export type MockItem = {
  id?: string | number;
  value: string;
};

export type MockServerData = {
  titles: MockItem[];
  descriptions: MockItem[];
  previewImages: MockItem[];
  images: MockItem[];
  userNames: MockItem[];
  userEmails: MockItem[];
  userAvatars: MockItem[];
};
