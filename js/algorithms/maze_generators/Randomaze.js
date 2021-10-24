function Randomaze(width, height) {
  const walls = [];

  for (let indexX = 0; indexX < width; indexX++) {
    const column = [];
    for (let indexY = 0; indexY < height; indexY++) {
      if (Math.floor(Math.random() * 3) === 0) {
        walls.push([indexX, indexY]);
      }
    }
  }
  return { walls: walls.slice(), fill: false };
}
