import Card from '@/views/responsive/Blog/card'
import React from 'react'

import styles from "./blog.module.css"


function BlogRes() {
  return (
    <div className={styles.container} >
        <h4 className={styles.head1}  >HomeShare <span>blog</span> </h4>
  <div className={styles.content} >
        {[...Array(8).keys()]?.map((v,i) => {
            return <Card key={i} />
        })}
    </div>
    <p style={{textAlign:"center",color:"#f8cd46",margin:"20px 0 4rem"}} >Load more...</p>
    </div>
   
  )
}

export default BlogRes