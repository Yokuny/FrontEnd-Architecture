export const GetSize = ({ width, height, expected }) => {

  const proportional =
    window.innerWidth > 600
      ? window.innerWidth > 1000
        ? expected * 1.3
        : expected * 1.1
      : expected;

  return (width > height ? width / height : height / width) * proportional;
};
