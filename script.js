function toggleImage(id) {
  const image = document.getElementById(id);
  if (image) {
    image.style.display = image.style.display === 'none' ? 'block' : 'none'; // Bascule entre visible et caché
  } else {
    console.log('Image non trouvée.');
  }
}
