export interface Item {
  id: number;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 1, name: 'Item One', description: 'Description for item one' },
  { id: 2, name: 'Item Two', description: 'Description for item two' },
  { id: 3, name: 'Item Three', description: 'Description for item three' },
  { id: 4, name: 'Item Four', description: 'Description for item four' },
  { id: 5, name: 'Item Five', description: 'Description for item five' },
  { id: 6, name: 'Item Six', description: 'Description for item six' },
  { id: 7, name: 'Item Seven', description: 'Description for item seven' },
  { id: 8, name: 'Item Eight', description: 'Description for item eight' },
  { id: 9, name: 'Item Nine', description: 'Description for item nine' },
  { id: 10, name: 'Item Ten', description: 'Description for item ten' },
];

export const fetchItems = (): Promise<Item[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(items);
    }, 500);
  });
};
