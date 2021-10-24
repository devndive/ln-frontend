export interface Tag {
  name: string;
}

export interface Metadata {
  id: number;
  title: string;
  description: string;
  image: string;
  estimatedTimeToRead: number;
}

export interface Link {
  id: number;
  url: string;
  description: string;
  metadata: Metadata;
  tags: Tag[];
}
