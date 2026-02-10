const activeIds = new Set();

function generateAnonymousName() {
  const num = Math.floor(Math.random() * 9000) + 1000;
  const name = "anonymous" + num;

  if (activeIds.has(name)) {
    return generateAnonymousName();
  }

  activeIds.add(name);
  return name;
}

function deleteAnonymousName(name) {
  activeIds.delete(name);
}

module.exports = { generateAnonymousName, deleteAnonymousName };