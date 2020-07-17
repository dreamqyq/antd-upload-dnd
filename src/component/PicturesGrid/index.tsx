import React, { CSSProperties, memo, useState } from 'react';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import './pictureGrid.css';
import { UploadFile } from 'antd/es/upload/interface';
import { UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { imagePreview } from '../../util/pictureUtil';
import UploadList from 'antd/es/upload/UploadList';
import { Modal, Upload } from 'antd';

type Props = {
  onChange: (params: { fileList: UploadFile[] }) => void
} & UploadProps
const PicturesGrid: React.FC<Props> = memo(({ onChange: onFileChange, ...props }) => {
  const [previewImage, setPreviewImage] = useState('');
  const fileList = props.fileList || [];
  console.log(fileList);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    onFileChange({ fileList: arrayMove(fileList, oldIndex, newIndex) });
  };

  const onChange = ({ fileList }: UploadChangeParam) => {
    onFileChange({ fileList });
  };

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(
      (item) => item.uid !== file.uid
    );
    onFileChange({ fileList: newFileList });
  };

  const onPreview = async (file: UploadFile) => {
    await imagePreview(file, ({ image }) => {
      setPreviewImage(image);
    });
  };

  const itemStyle: CSSProperties = {
    width: 104,
    height: 104,
    margin: 4,
    cursor: 'grab'
  };
  const SortableItem = SortableElement(({ item }: { item: UploadFile }) => (
    <div style={itemStyle}>
      <UploadList
        locale={{ previewFile: '预览图片', removeFile: '删除图片' }}
        showDownloadIcon={false}
        listType={props.listType}
        onPreview={onPreview}
        onRemove={onRemove}
        items={[item]}
      />
    </div>
  ));


  const listStyle: CSSProperties = { display: 'flex', flexWrap: 'wrap', maxWidth: 720 };
  const SortableList = SortableContainer(({ items }: { items: UploadFile[] }) => (
    <div style={listStyle}>
      {items.map((item, index) => (
        <SortableItem
          key={`${item.uid}`}
          index={index}
          item={item}
        />
      ))}
      <Upload
        {...props}
        fileList={fileList}
        showUploadList={false}
        onChange={onChange}
      >
        {props.children}
      </Upload>
    </div>
  ));

  return (
    <>
      <SortableList
        // 当移动 1 之后再触发排序事件，默认是0，会导致无法触发图片的预览和删除事件
        distance={1}
        items={fileList}
        onSortEnd={onSortEnd}
        axis="xy"
        helperClass="SortableHelper"
      />
      <Modal
        visible={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage('')}
        bodyStyle={{ padding: 0 }}
      >
        <img style={{ width: '100%' }} alt="" src={previewImage} />
      </Modal>
    </>
  );
});

export { PicturesGrid };

