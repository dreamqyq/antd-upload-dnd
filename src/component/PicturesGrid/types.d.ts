import { UploadFile } from 'antd/es/upload/interface';
import { UploadProps } from 'antd/lib/upload';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { ReactNode } from 'react';

export type Props = {
  onChange: (params: { fileList: UploadFile[] }) => void;
  children?: ReactNode;
} & UploadProps

type SortableParams = {
  props: Omit<Props, 'onChange'>;
  onPreview: (file: UploadFile) => void;
  onRemove: (file: UploadFile) => void | boolean;
}

export type SortableItemParams = {
  item: UploadFile;
} & SortableParams

export type SortableListParams = {
  onChange: (info: UploadChangeParam) => void;
  items: UploadFile[];
} & SortableParams

