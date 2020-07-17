import React, { useState } from 'react';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import './pictureGrid.css';
import defaultFileList from './defaultFileList';
import { UploadFile } from 'antd/es/upload/interface';

const SortableComponent: React.FC = () => {
  const [items, setItems] = useState(defaultFileList);
  console.log(items);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const SortableItem = SortableElement(({ item }: { item: UploadFile }) => (
    <div className="item">
      <div className="inner-item">
        <img src={item.url} alt='' />
      </div>
    </div>
  ));

  const SortableList = SortableContainer(({ items }: { items: UploadFile[] }) => (
    <div className="container">
      {items.map((item, index) => (
        <SortableItem
          key={`${item.uid}`}
          index={index}
          item={item}
        />
      ))}
      上传按钮
    </div>
  ));

  return (
    <SortableList
      items={items}
      onSortEnd={onSortEnd}
      axis="xy"
      helperClass="SortableHelper"
    />
  );
};

export { SortableComponent };

