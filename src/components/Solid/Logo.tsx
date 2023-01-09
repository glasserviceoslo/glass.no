import LogoDark from '/assets/logo-dark.svg';
import LogoLight from '/assets/logo-light.svg';

export const Logo = () => {
  // aspectRatio={7.9 / 2.9}

  return (
    <a href="/" class="flex items-center">
      <img
        src={LogoLight}
        loading="lazy"
        class="mr-3 hidden aspect-auto h-10 w-auto dark:block md:h-12"
        alt="Glass.no Logo"
        width={100}
        height={40}
        sizes="50em, 30em, 20em"
      />
      <img
        src={LogoDark}
        loading="lazy"
        class="mr-3 block aspect-auto h-10 w-auto dark:hidden md:h-12"
        alt="Glass.no Logo"
        width={100}
        height={40}
        sizes="50em, 30em, 20em"
      />
    </a>
  );
};
