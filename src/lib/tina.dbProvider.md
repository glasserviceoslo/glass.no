import type { AbstractDatabaseOptions, AbstractOpenOptions } from 'abstract-level';
import { AbstractIterator, AbstractLevel } from 'abstract-level';
import type { NextCallback } from 'abstract-level/types/abstract-iterator';
import ModuleError from 'module-error';
import { Redis, type RedisOptions } from 'ioredis';

const DEFAULT_LIMIT = 50;

const encode = (value: ANY) => encodeURIComponent(value);
const decode = (value: string) => decodeURIComponent(value);

const encodeFilter = (filter: string) => {
  if (filter.endsWith('\uFFFF')) {
    return `${encodeURIComponent(filter.slice(0, -1))}\uFFFF`;
  }
  return encodeURIComponent(filter);
};

export type RedisLevelOptions<K, V> = {
  redis: RedisOptions;
  debug?: boolean;
  namespace?: string;
} & AbstractDatabaseOptions<K, V>;

declare type BatchOperation = BatchPutOperation | BatchDelOperation;

/**
 * A _put_ operation to be committed by a {@link RedisLevel}.
 */
declare interface BatchPutOperation {
  /**
   * Type of operation.
   */
  type: 'put';

  /**
   * Key of the entry to be added to the database.
   */
  key: string;

  /**
   * Value of the entry to be added to the database.
   */
  value: string;
}

/**
 * A _del_ operation to be committed by a {@link RedisLevel}.
 */
declare interface BatchDelOperation {
  /**
   * Type of operation.
   */
  type: 'del';

  /**
   * Key of the entry to be deleted from the database.
   */
  key: string;
}

declare interface ClearOptions<KDefault> {
  gt?: KDefault;
  gte?: KDefault;
  lt?: KDefault;
  lte?: KDefault;
  limit: number;
  reverse: boolean;
  keyEncoding: string;
  valueEncoding: string;
}

interface IteratorOptions<KDefault> {
  offset: number; // Offset for pagination in commands like ZRANGE
  limit: number; // Limit the number of results in commands like ZRANGE
  keyEncoding: string;
  valueEncoding: string;
  reverse: boolean; // Whether to reverse the order of results
  keys: boolean; // Whether to return keys
  values: boolean; // Whether to return values
  gt?: KDefault; // Greater than, exclusive
  gte?: KDefault; // Greater than or equal, inclusive
  lt?: KDefault; // Less than, exclusive
  lte?: KDefault; // Less than or equal, inclusive
  debug: boolean; // Debug flag to enable logging
  byLex?: boolean; // Specify if the range should be by lexicographical order
}

const queryFromOptions = (key: string, options: IteratorOptions<ANY>): [string, string, string, ...ANY[]] => {
  const min =
    options.gte !== undefined
      ? `[${encodeFilter(options.gte)}`
      : options.gt !== undefined
        ? `(${encodeFilter(options.gt)}`
        : '-';
  const max =
    options.lte !== undefined
      ? `[${encodeFilter(options.lte)}`
      : options.lt !== undefined
        ? `(${encodeFilter(options.lt)}`
        : '+';

  let args: [string, string, string, ...ANY[]] = [key, min, max];

  if (options.byLex) {
    // Handle ZRANGEBYLEX options here
  } else {
    if (options.limit !== undefined) {
      // Properly format the LIMIT clause
      args = args.concat(['LIMIT', options.offset.toString(), options.limit.toString()]) as ANY;
    }
    if (options.reverse) {
      // Handle reverse range
      args.unshift('ZREVRANGE');
    } else {
      args.unshift('ZRANGE');
    }
  }

  return args;
};

class RedisIterator<KDefault, VDefault> extends AbstractIterator<RedisLevel<KDefault, VDefault>, KDefault, VDefault> {
  private redis: Redis;
  private options: IteratorOptions<KDefault>;
  private offset: number;
  private readonly resultLimit: number;
  private results: ANY[];
  private finished: boolean;
  private debug: boolean;

  constructor(db: RedisLevel<KDefault, VDefault>, options: IteratorOptions<KDefault>) {
    super(db, options);
    this.redis = db.redis;
    this.options = options;
    this.resultLimit = options.limit !== Number.POSITIVE_INFINITY && options.limit >= 0 ? options.limit : DEFAULT_LIMIT;
    this.offset = options.offset || 0;
    this.results = [];
    this.finished = false;
    this.debug = options.debug || false;
  }

  async _next(callback: NextCallback<KDefault, VDefault>) {
    if (this.finished) {
      return process.nextTick(callback, null);
    }
    if (this.results.length === 0) {
      const getKeys = this.options.keys;
      const getValues = this.options.values;
      const query = queryFromOptions(this.db.zKey, { ...this.options, offset: this.offset, limit: this.resultLimit });
      if (this.debug) {
        console.log('query', query);
      }
      let keys: string[] = [];
      try {
        keys = await this.redis.zrange(...query);
      } catch (e) {
        console.log(e);
      }
      if (this.debug) {
        console.log('keys', keys);
      }
      if (!keys || keys.length === 0) {
        this.finished = true;
        return process.nextTick(callback, null);
      }
      const values = getValues ? await this.redis.hmget(this.db.hKey, ...keys) : null;
      for (const key of keys) {
        const decodedKey = decode(key);
        const result = [];
        result.push(getKeys ? decodedKey : undefined);
        if (getValues) {
          if (!values) {
            result.push(undefined);
          } else {
            result.push(values[key as ANY] !== undefined ? decode(String(values[key as ANY])) : undefined);
          }
        }
        this.results.push(result);
      }
      this.offset += this.resultLimit;
    }
    const result = this.results.shift();
    if (this.debug) {
      console.log('result', result);
    }
    return process.nextTick(callback, null, ...result);
  }
}

export class RedisLevel<KDefault = string, VDefault = string> extends AbstractLevel<string, KDefault, VDefault> {
  public readonly redis: Redis;
  public readonly hKey: string;
  public readonly zKey: string;
  private readonly debug: boolean;

  constructor(options: RedisLevelOptions<KDefault, VDefault>) {
    super({ encodings: { utf8: true }, snapshots: false }, options);
    this.redis = new Redis(options.redis);
    const namespace = options.namespace || 'level';
    this.hKey = `${namespace}:h`;
    this.zKey = `${namespace}:z`;
    this.debug = options.debug || false;
  }

  get type() {
    return 'redis';
  }

  async _open(options: AbstractOpenOptions, callback: (error?: Error) => void) {
    if (this.debug) {
      console.log('RedisLevel#_open');
    }
    process.nextTick(callback);
  }

  async _close(callback: (error?: Error) => void) {
    if (this.debug) {
      console.log('RedisLevel#_close');
    }
    process.nextTick(callback);
  }

  async _get(
    key: string,
    options: { keyEncoding: 'utf8'; valueEncoding: 'utf8' },
    callback: (error?: Error, value?: string) => void,
  ) {
    if (this.debug) {
      console.log('RedisLevel#_get', key);
    }
    const data = await this.redis.hget(this.hKey, encode(key));
    if (data !== null) {
      if (this.debug) {
        console.log('RedisLevel#_get', key, 'found', decode(data));
      }
      return process.nextTick(callback, null, decode(data));
    }
    return process.nextTick(
      callback,
      new ModuleError(`Key '${key}' was not found`, {
        code: 'LEVEL_NOT_FOUND',
      }),
    );
  }

  async _getMany(
    keys: string[],
    options: { keyEncoding: 'utf8'; valueEncoding: 'utf8 ' },
    callback: (error?: Error, value?: string) => void,
  ) {
    if (this.debug) {
      console.log('RedisLevel#_getMany', keys);
    }
    try {
      const data = await this.redis.hmget(this.hKey, ...keys.map((key) => encode(key)));
      // TODO not sure if the we need to encode the key when retrieving it from the data object...
      if (data) {
        return process.nextTick(
          callback,
          null,
          keys.map((key) => (data[key as ANY] ? decode(String(data[key as ANY])) : undefined)),
        );
      }
      return process.nextTick(
        callback,
        null,
        keys.map((key) => undefined),
      );
    } catch (e) {
      console.log(e);
      return process.nextTick(
        callback,
        new ModuleError('Unexpected error in getMany', {
          code: 'LEVEL_NOT_FOUND',
        }),
      );
    }
  }

  async _put(
    key: string,
    value: string,
    options: { keyEncoding: 'utf8'; valueEncoding: 'utf8' },
    callback: (error?: Error) => void,
  ) {
    if (this.debug) {
      console.log('RedisLevel#_put', key, value);
    }
    await this.redis.hset(this.hKey, { [encode(key)]: encode(value) });
    await this.redis.zadd(this.zKey, 0, encode(key));
    process.nextTick(callback);
  }

  async _del(key: Buffer, options: ANY, callback: (error?: Error) => void) {
    if (this.debug) {
      console.log('RedisLevel#_del', key);
    }
    await this.redis.hdel(this.hKey, encode(key));
    await this.redis.zrem(this.zKey, encode(key));
    process.nextTick(callback);
  }

  async _batch(batch: BatchOperation[], options: ANY, callback: (error?: Error) => void): Promise<void> {
    if (this.debug) {
      console.log('RedisLevel#_batch', batch);
    }
    if (batch.length === 0) return process.nextTick(callback);
    const p = this.redis.pipeline();
    for (const op of batch) {
      if (op.type === 'put') {
        p.hset(this.hKey, { [encode(op.key)]: encode(op.value) });
        p.zadd(this.zKey, 0, encode(op.key));
      } else if (op.type === 'del') {
        p.hdel(this.hKey, encode(op.key));
        p.zrem(this.zKey, encode(op.key));
      }
    }
    await p.exec();
    process.nextTick(callback);
  }

  async _clear(options: ClearOptions<KDefault>, callback: (error?: Error) => void): Promise<void> {
    if (this.debug) {
      console.log('RedisLevel#_clear', options);
    }
    const limit =
      options.limit !== Number.POSITIVE_INFINITY && options.limit >= 0 ? options.limit : Number.POSITIVE_INFINITY;
    let offset = 0;
    const fetchLimit = 100;
    let total = 0;
    while (true) {
      const query = queryFromOptions(this.zKey, {
        debug: false,
        keys: true,
        values: false,
        ...options,
        offset,
        limit: fetchLimit,
      });
      let keys: string[] = [];
      try {
        keys = await this.redis.zrange(...query);
      } catch (e) {
        console.log(e);
      }
      if (!keys || keys.length === 0) {
        break;
      }
      if (keys.length + total > limit) {
        keys = keys.slice(0, limit - total);
      }
      await this.redis.hdel(this.hKey, ...keys);
      await this.redis.zrem(this.zKey, ...keys);
      offset += fetchLimit;
      total += keys.length;
      if (total >= limit) {
        break;
      }
    }
    process.nextTick(callback);
  }

  _iterator(options: IteratorOptions<KDefault>): RedisIterator<KDefault, VDefault> {
    return new RedisIterator<KDefault, VDefault>(this, { ...options, debug: this.debug });
  }
}
