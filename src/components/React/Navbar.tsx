/** @jsxImportSource react */

import { useLayoutEffect } from 'react';
import type { NavbarProps } from 'sanity';

const Navbar = (props: NavbarProps) => {
  useLayoutEffect(() => {
    const logo = document.querySelector('[data-testid="logo"]');
    const redirectToHome = () => (window.location.href = '/');
    logo?.addEventListener('click', redirectToHome);

    return () => logo?.removeEventListener('click', redirectToHome);
  }, []);

  return props.renderDefault(props);
};

export default Navbar;
