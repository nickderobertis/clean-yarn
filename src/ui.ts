const broomAscii = `
  ||
  ||
  ||
  ||
  ||
  ||
  ||     Here you go, let's sweep
  ||     that up..............
 /||\\
/||||\\
======         __|__
||||||        / ~@~ \\
||||||       |-------|
||||||       |_______|
`;

/**
 * Display a broom ascii art
 */
function displayBroom() {
  console.log(broomAscii);
}

const nameb64 =
  "ICAgICAgICBfXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDQogIF9fX19fLyAvX18gIF9fX18gX19fX18gICAgICAgIF9fICBfX19fX18gX19fX19fX19fXyANCiAvIF9fXy8gLyBfIFwvIF9fIGAvIF9fIFxfX19fX18vIC8gLyAvIF9fIGAvIF9fXy8gX18gXA0KLyAvX18vIC8gIF9fLyAvXy8gLyAvIC8gL19fX19fLyAvXy8gLyAvXy8gLyAvICAvIC8gLyAvDQpcX19fL18vXF9fXy9cX18sXy9fLyAvXy8gICAgICBcX18sIC9cX18sXy9fLyAgL18vIC9fLyANCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL19fX18vICAgICAgICAgICAgICAgICAgIA==";

function displayName() {
  const data = Buffer.from(nameb64, "base64");
  console.log(new TextDecoder().decode(data));
}

export function displayHeader(): void {
  displayName();
  displayBroom();
}
