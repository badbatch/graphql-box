export interface PlainObjectMap {
  [key: string]: any;
}

export interface PlainObjectStringMap {
  [key: string]: any;
}

export interface DataType {
  [key: string]: PlainObjectMap;
}

export interface RequestResponseGroup {
  requests: PlainObjectStringMap;
  responses: DataType;
}
