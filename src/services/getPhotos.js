
// Esta función realiza el fetch de datos a la url que se muestra
export async function getPhotos() {
  const data = await fetch('https://jsonplaceholder.typicode.com/photos').then(res => res.json())
  return data
}