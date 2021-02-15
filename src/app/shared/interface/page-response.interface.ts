export interface PageResponseInterface {
  first: PageInterface;
  last: PageInterface;
  total: number;
  records: number;
  next: PageInterface;
  previous: PageInterface;
  Data: [];
}

interface PageInterface {
  index: number;
  size: number;
}

