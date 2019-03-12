const token = INSTAGRAM_TOKEN,
  userid = "self",
  num_photos = 10; // how much photos do you want to get

(async () => {
  class GalleryImage {
    constructor(url) {
      this.img_container = document.createElement("div");
      this.img_container.setAttribute("class", "gallery-image");
      this.img = document.createElement("img");
      this.img.setAttribute("src", url);
      this.img_container.appendChild(this.img);
      return this.img_container;
    }
  }

  const response = await fetch(
    `https://api.instagram.com/v1/users/${userid}/media/recent/?access_token=${token}&count=${num_photos}`
  ).catch(err => {
    console.error(err);
  });
  const data = await response.json();
  if (data) {
    const container = document.createElement("div");
    container.setAttribute("id", "gallery-container");
    [...data.data].forEach(({ images }) => {
      if (images.standard_resolution.url) {
        container.appendChild(new GalleryImage(images.standard_resolution.url));
      }
    });
    document.body.appendChild(container);
  }
})();
