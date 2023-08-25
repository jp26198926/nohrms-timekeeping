// IndexedDBService.js

import { openDB } from 'idb';

export function useIndexedDB(dbName, dbVersion, storeName) {

  async function openDatabase() {
    return await openDB(dbName, dbVersion, {
      upgrade(db) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async function saveData(data) {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(data);
  }

  async function deleteDataById(id) {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(id);
  }

  async function getAllData() {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return await store.getAll();
  }

  async function deleteAllData() {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
  }

  return { saveData, deleteDataById, getAllData, deleteAllData };
}

