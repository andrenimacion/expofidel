import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {

  constructor() { }
  
  createIndexedDB(databaseName, tagNumberVersion) {
    var db;
    
    const request = indexedDB.open(databaseName, tagNumberVersion);
    request.onerror = (error) => console.log(error);
    
    request.onsuccess = () => {
      const transaction =  db.transaction([databaseName], 'readwrite');
      transaction.objectStore(databaseName);
    }

    request.onupgradeneeded = () => {
      db = request.result;
      db.createObjectStore( databaseName, {
        autoIncrement: true,
        // keyPath: 'con'
      });
    }

  }

  saveDataIndexedDB(databaseName, tagNumberVersion, data) {

    var db;
    const request = indexedDB.open(databaseName, tagNumberVersion);
    request.onerror = (error) => console.log(error);
    request.onsuccess = () => {

      db = request.result;
      const transaction = db.transaction([databaseName], 'readwrite');
      const objectStore = transaction.objectStore(databaseName);
      objectStore.add(data);

    }
  }

  elBDData(databaseName) {
     return indexedDB.deleteDatabase(databaseName);
  }  

}

