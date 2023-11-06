import fs from 'fs';
import path from 'path';
import data from './data.json';

type User = {
  email: string;
  gender: string;
  phone_number: string;
  birthdate: number;
  location: {
    street: string;
    city: string;
    state: string;
    postcode: string | number;
  };
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  title: string;
  picture: string;
};

const dBReadTime = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, Math.floor(Math.random() * (80 - 20 + 1)) + 20);
  });

export class PostgreSQL {
  private data: User[] = [];
  private dbCalls: number = 0;

  constructor() {}

  async connect(): Promise<void> {
    this.data = data;
    this.dbCalls = 0;
    console.log('Connected to database');
  }

  async query(queryString: string, params?: any[]): Promise<{ rows: User[] }> {
    await dBReadTime();
    this.dbCalls += 1;
    console.log('DB calls aggregated: ', this.dbCalls);
    const match = queryString.match(
      /SELECT \* FROM users WHERE first_name LIKE '(.+)'/
    );

    if (match && params && params[0]) {
      const firstLetter = params[0];
      const filteredData = this.data.filter((user) =>
        user.first_name.startsWith(firstLetter)
      );
      return { rows: filteredData };
    }
    return { rows: [] };
  }

  async end(): Promise<void> {
    console.log('Disconnected from mock database');
  }
}
