// Script Start

document.addEventListener("DOMContentLoaded", function () {
  // Mendefinisikan var konstanta, mulai dari URL API, dan mengenali tombol get di HTML, serta mengenali kontainer div untuk menampilkan pokemon
  const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=36";
  const getPokemonsButton = document.getElementById("getPokemons");
  const showPokemonsInfo = document.getElementById("showPokemons");
  const pokemonUrls = []; // Mendefinisikan variabel untuk mengumpulkan URL di dalam array
  let isAllCardDisplayed = false; // Membuat variable Flag/pengecek tanda. Berfungsi agar kartu Pokemon Card tidak terus menumpuk, nilai dibuat false terlebih dahulu

  // Membuat fungsi untuk meminta data pokemon menggunakan Fetch. Kita bisa memodifikasi parameter (response, data) sesuai keinginan
  function getPokemonsData() {
    if (!isAllCardDisplayed) {
      fetch(apiUrl)
        .then((response) => response.json()) // Mengubah respon menjadi objek JSON.
        .then((data) => {
          const pokemonsData = data.results; // Mendefinisikan var, dan mengambil keseluruhan data di array Results

          // Karena ingin mengambil data hanya "url", kode ini akan membuat iterasi untuk url saja, dimana pokemonsData akan diambil/diiterasi menggunakan forEach dan membuat nama elemen baru "pokemon", lalu membuat fungsi dimana kita membuat array baru benama pokemonUrls dan mengelompokkan seluruh url yang ada di pokemonsData
          pokemonsData.forEach((pokemon) => {
            pokemonUrls.push(pokemon.url); // pokemonUrls adalah data array yang sudah didefinisikan di atas, dan dimasukkan semua url
          });

          // Selanjutnya, kita akan melakukan permintaan banyak (batch) atau sekaligus untuk seluruh url yang telah kita dapatkan dan kelompokkan untuk semua pokemon
          Promise.all(
            // Menjalankan perintah secara bersamaan, tanpa perlu menunggu satu per satu
            pokemonUrls.map(
              (
                url // Mengambil setiap URL di dalam array pokemonUrls
              ) =>
                fetch(url) // URL yang sudah diambil satu per satu menggunakan "map", akan difetch
                  .then((response) => response.json()) // Respon diubah ke JSON
            )
          )
            .then((dataArray) => {
              showPokemonsInfo.innerHTML = ""; // Mengosongkan kontainer results terlebih dahulu
              dataArray.forEach((pokemonDatabase) => {
                const pokemonNumber = pokemonDatabase.id;
                const pokemonName = pokemonDatabase.name;
                const pokemonType = pokemonDatabase.types[0].type.name;
                const pokemonImage = pokemonDatabase.sprites.front_default;

                // Membuat elemen HTML untuk menampilkan data Pokemon dari hasil fetch API nya, menggunakan kartu Pokemon
                const pokemonCard = document.createElement("div");
                pokemonCard.classList.add("pokemon-card");
                pokemonCard.classList.add(pokemonType); // Menambahkan kelas pokemon, untuk mengatur warna background kartu

                // Setelah membuat elemen, saatnya untuk mengisi informasi pokemon ke kartu
                pokemonCard.innerHTML = `
               <h3>${pokemonNumber} : ${pokemonName}</h3>
               <img src="${pokemonImage}" alt="${pokemonName}">
               <p> Type: ${pokemonType} </p>
             `;

                // Menambahkan kartu pokemon ke dalam kontainer
                showPokemonsInfo.appendChild(pokemonCard);
              });
              isAllCardDisplayed = true; // Ubah ke true, sehingga ketika klik get kembali, kartu pokemon tidak terduplikasi
            })
            .catch((error) => console.error("Terjadi kesalahan:", error));
        })
        .catch((error) => console.error("Terjadi kesalahan:", error));
    }
  }

  // Menambahkan event listener, ketika di click buttonnya, maka kartu pokemon bisa muncul
  getPokemonsButton.addEventListener("click", getPokemonsData);
});
