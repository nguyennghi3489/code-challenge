import { LazySvgProps, useLazySvgImport } from "../hooks/useLazySvgImport";

export const LazySvg = ({ name, ...props }: LazySvgProps) => {
  const { loading, error, Svg } = useLazySvgImport(name);

  if (error) {
    return null;
  }

  if (loading) {
    return "Loading...";
  }

  if (!Svg) {
    return null;
  }

  return <Svg {...props} />;
};
