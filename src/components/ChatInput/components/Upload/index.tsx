import React, { memo, Fragment, useRef, useCallback, CSSProperties, useMemo } from 'react'
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Upload } from 'chunk-file-upload'
import styles from './index.less'

const cursor: CSSProperties = {
  cursor: 'pointer',
  fontSize: 20
}

export type FileType = {

}

export type UploadProps = {
  icon: "video" | "image"
  onChange?: (value: FileType) => void 
}

const ImageUpload = memo((props: UploadProps) => {

  const { icon } = useMemo(() => {
    return props 
  }, [props])

  const handleSelectFile = useCallback(() => {

  }, [])

  const IconNode = useMemo(() => {
    if(icon === 'image') return <FileImageOutlined style={cursor} onClick={handleSelectFile} />
    if(icon === 'video') return <VideoCameraOutlined style={cursor} onClick={handleSelectFile} />
  }, [icon, handleSelectFile])

  const inputFileProps = useMemo(() => {
    console.log(icon)
    return {}
  }, [icon])  

  const inputRef = useRef(null)

  const onChange = useCallback(() => {
    // if(this.state.control) return
    // const file = e.target.files[0]
    // const that = this
    // const [name] = this.upload.add({
    //   file: {
    //     file,
    //     mime: file.type
    //   },
    //   request: {
    //     exitDataFn: this.exitDataFn,
    //     uploadFn: this.uploadFn,
    //     completeFn: (...values) => {
    //       this.completeFn(...values)
    //     },
    //     callback: (err, value) => {
    //       this.callback(err, value)
    //       this.setState({
    //         control: null,
    //         name: null
    //       })
    //     },
    //   },
    //   lifecycle: {
    //     reading({ name, task, current, total }) {
    //       console.log('loading: ', current, 'total', total)
    //     },
    //     uploading({ complete, total }) {
    //       that.setState({
    //         progress: Math.ceil(complete / total) * 100
    //       })
    //     }
    //   }
    // })
    // this.setState({
    //   name,
    //   control: file
    // })
  }, [])

  return (
    <Fragment>
      <input {...inputFileProps} ref={inputRef} className={styles["upload-input"]} type="file" onChange={onChange} />
      {
        IconNode
      }
    </Fragment>
  )

})

export default ImageUpload