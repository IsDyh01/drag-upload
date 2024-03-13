import classnames from "classnames";
import "./App.less";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileInfoType } from "./type/fileInfoType";
import upload from "./image/upload.png";
import deleteImg from "./image/delete.jpg";

const App = () => {
  const [fileList, setFileList] = useState<File[]>([]); // 文件列表
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const fileContainerRef = useRef<HTMLDivElement | null>(null);
  const [fileContainerIsActive, setFileContainerIsActive] =
    useState<boolean>(false);

  const readFileEntry = useCallback((entry: FileSystemEntry | null) => {
    if (entry?.isFile) {
      // 文件夹entry
      entry.file((file: File) => {
        setFileList((list) => [...list, file]);
      });
    } else {
      // 创建文件夹enty的reader
      const reader = entry?.createReader();
      // reader上有readEntries方法，可以读取entry下的所有子entry，子entry可能又包含文件夹entry或者文件entry
      reader.readEntries((entries: FileSystemEntry[]) => {
        entries.forEach((entry: FileSystemEntry) => {
          readFileEntry(entry);
        });
      });
    }
  }, []);

  const fileInfo = useMemo<FileInfoType>(() => {
    const count = fileList.length;
    const size = fileList.reduce((pre, cur) => {
      return Math.ceil((pre + cur.size) / 1024 / 1024);
    }, 0);
    return {
      fileCount: count,
      fileSize: size,
    };
  }, [fileList]);

  useEffect(() => {
    // 拖拽物品进入容器时触发
    fileContainerRef.current?.addEventListener("dragenter", (e) => {
      e.preventDefault();
      // 进入时设置容器hover状态
      setFileContainerIsActive(true);
    });
    // 拖拽物品再容器上方时一直触发
    fileContainerRef.current?.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    // 拖拽物品离开容器时触发
    fileContainerRef.current?.addEventListener("dragleave", (e) => {
      e.preventDefault();
      // 离开时设置容器hover状态
      setFileContainerIsActive(false);
    });
    // 拖拽物品进入容器候松开左键后触发
    fileContainerRef.current?.addEventListener("drop", (e) => {
      console.log("drop");

      e.preventDefault();
      // 松开左键时设置容器hover状态
      setFileContainerIsActive(false);
      // 获取拖拽进来的物品
      for (let item of e.dataTransfer?.items!) {
        // console.log(item);
        // 获取每个item的Entry对象，包含文件entry和文件夹entry
        const entry = item.webkitGetAsEntry();
        readFileEntry(entry);
      }
    });

    // 监听隐藏文件选择框的change事件，可以支持正常的选择文件
    hiddenInputRef.current?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const list = Array.from(target.files!);
      setFileList([...fileList, ...list]);
    });
  }, []);

  // 容器的点击事件，委托成隐藏的文件选择框的点击事件
  const fileCOntainerClick = () => {
    hiddenInputRef.current?.click();
  };

  // 文件删除
  const deleteFile = (idx: number) => {
    setFileList(
      fileList.filter((item, index) => {
        return index !== idx;
      })
    );
  };
  return (
    <div className="drag-upload">
      <div
        className={classnames(
          "file",
          fileContainerIsActive && "file-container-active"
        )}
        ref={fileContainerRef}
        onClick={fileCOntainerClick}
      >
        <div className="hidden-input" style={{ display: "none" }}>
          <input ref={hiddenInputRef} type="file" multiple />
        </div>
        <div className="image">
          <img src={upload} alt="上传" />
        </div>
        <div className="file-text">请选择文件上传或拖拽上传</div>
      </div>
      {/* <!-- 文件总览 --> */}
      <div className="file-info">
        <div className="file-count">共{fileInfo.fileCount}个文件</div>
        <div className="file-size">共{fileInfo.fileSize}MB</div>
      </div>
      {/* 文件列表 */}
      <div className="file-list">
        {fileList.map((item: File, idx: number) => {
          return (
            <div className="item" key={idx}>
              <div className="name">{item.name}</div>
              <div className="delete" onClick={() => deleteFile(idx)}>
                <img src={deleteImg} alt="" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
