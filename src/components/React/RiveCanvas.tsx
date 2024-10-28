import Rive from '@rive-app/react-canvas';

type Props = {
  src: string;
};

export const RiveCanvas = ({ src }: Props) => (
  <Rive src={src} width={500} height={500} className="mx-auto h-auto w-3/5 lg:h-[90%] lg:w-[90%]" />
);
