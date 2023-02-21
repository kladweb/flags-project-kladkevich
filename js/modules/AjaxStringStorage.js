export class AjaxStringStorage {
  static sendHttpRequest(method, url, data) {
    return fetch(url, {
      method: method,
      body: data
    })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log('err!!!', error);
    });
  }

  storageHost = 'https://fe.it-academy.by/AjaxStringStorage2.php';
  storageName = 'KLADKEVICH_STORAGE_FLAG';

  async loadData() {
    let fd = new FormData();
    fd.append('f', 'READ');
    fd.append('n', this.storageName);
    return await AjaxStringStorage.sendHttpRequest(
      'POST',
      this.storageHost,
      fd
    );
  }

  saveData(dataForSave) {
    let password = Math.random().toString();
    let fd = new FormData();
    fd.append('f', 'LOCKGET');
    fd.append('n', this.storageName);
    fd.append('p', password);
    let resultInfo = AjaxStringStorage.sendHttpRequest(
      'POST',
      this.storageHost,
      fd
    );
    console.log('resultInfo', resultInfo);
    fd = new FormData();
    fd.append('f', 'UPDATE');
    fd.append('n', this.storageName);
    fd.append('v', JSON.stringify(dataForSave));
    fd.append('p', password);
    let result = AjaxStringStorage.sendHttpRequest(
      'POST',
      this.storageHost,
      fd
    );
    console.log('result', result, result);
  }
}

// sendHttpRequest(method, url, data) {
//   return fetch(url, {
//     method: method,
//     body: data
//   })
//   .then(response => {
//     return response.json();
//   })
//   .catch(error => {
//     console.log('err!!!', error);
//   });
// }


// async loadData() {
//   let fd = new FormData();
//   fd.append('f', 'READ');
//   fd.append('n', 'KLADKEVICH_STORAGE_FLAG');
//   // fd.append('v', JSON.stringify({records: this.scList}));
//
//   const responseData = await this.sendHttpRequest(
//     'POST',
//     'https://fe.it-academy.by/AjaxStringStorage2.php',
//     fd
//   );
//   if (responseData) {
//     this.scList = JSON.parse(responseData.result);
//     return responseData;
//   } else {
//     this.scList = false;
//   }
// }
//
// async saveData() {
//   this.password = Math.random();
//   let fd = new FormData();
//   fd.append('f', 'LOCKGET');
//   fd.append('n', 'KLADKEVICH_STORAGE_FLAG');
//   fd.append('p', this.password);
//   let resultInfo = await this.sendHttpRequest(
//     'POST',
//     'https://fe.it-academy.by/AjaxStringStorage2.php',
//     fd
//   );
//   console.log('resultInfo', resultInfo);
//   fd = new FormData();
//   fd.append('f', 'UPDATE');
//   fd.append('n', 'KLADKEVICH_STORAGE_FLAG');
//   fd.append('v', JSON.stringify(this.scList));
//   fd.append('p', this.password);
//   let result = await this.sendHttpRequest(
//     'POST',
//     'https://fe.it-academy.by/AjaxStringStorage2.php',
//     fd
//   );
//   console.log('result', result, result);
// }