import { ComponentProps, FC, useEffect, useRef, useState } from "react";

export interface LazySvgProps extends ComponentProps<"svg"> {
  name: string;
}

// This hook can be used to create your own wrapper component.
export const useLazySvgImport = (name: string) => {
  const importRef = useRef<FC<ComponentProps<"svg">>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        importRef.current = (
          await import(`../assets/tokens/${name}.svg?react`)
        ).default; // We use `?react` here following `vite-plugin-svgr`'s convention.
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);

  return {
    error,
    loading,
    Svg: importRef.current,
  };
};
