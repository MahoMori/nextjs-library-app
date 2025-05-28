export interface Book {
  id: string;
  title: string;
  author: string;
  published_date: string;
  genre: string;
  is_borrowed: boolean;
  num_of_holds: number;
  num_of_copies: number;
  book_cover: string;
  usernum_in_line?: number;
  remaining_days?: number;
  renew_count?: number;
}

export interface User {
  username: string;
  uid: string;
  checked_out: UserCheckedOut[];
  on_hold: UserOnHold[];
  for_later: string[];
}

export interface UserCheckedOut {
  id: string;
  remaining_days: number;
  renew_count: number;
}

export interface UserOnHold {
  id: string;
  usernum_in_line: number;
}
