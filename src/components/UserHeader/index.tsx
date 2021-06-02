import React, { memo } from 'react'
import { PageHeader } from 'antd'
import { PageHeaderProps } from 'antd/es/page-header'
import styles from './index.less'

export default memo((props: PageHeaderProps) => {

  return (
    <PageHeader
      className={styles["user-header"]}
      onBack={() => window.history.back()}
      title="Title"
      subTitle="This is a subtitle"
      {...props}
    >
      
    </PageHeader>
  )

})