import { createSignal } from 'solid-js';
import { Motion } from '@motionone/solid';

export const Animation = ({ children }: any) => {
  const [count, setCount] = createSignal(0);
  const add = () => setCount(count() + 1);
  const subtract = () => setCount(count() - 1);

  return (
    <Motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 1, easing: 'ease-in-out' }}>
      <div class="counter">
        <button onClick={subtract}>-</button>
        <pre>{count()}</pre>
        <button onClick={add}>+</button>
      </div>
      <div class="counter-message">{children}</div>
    </Motion.div>
  );
};
