import OSS from 'ali-oss'
import COS from 'cos-nodejs-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

class StorageService {
  constructor() {
    this.aliOSS = null
    this.tencentCOS = null
    this.currentProvider = process.env.STORAGE_PROVIDER || 'aliyun'
  }

  // 初始化阿里云OSS
  initAliOSS() {
    if (!this.aliOSS) {
      this.aliOSS = new OSS({
        region: process.env.ALIYUN_OSS_REGION,
        accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET,
        bucket: process.env.ALIYUN_OSS_BUCKET
      })
    }
    return this.aliOSS
  }

  // 初始化腾讯云COS
  initTencentCOS() {
    if (!this.tencentCOS) {
      this.tencentCOS = new COS({
        SecretId: process.env.TENCENT_COS_SECRET_ID,
        SecretKey: process.env.TENCENT_COS_SECRET_KEY,
        Region: process.env.TENCENT_COS_REGION
      })
    }
    return this.tencentCOS
  }

  // 生成文件名
  generateFileName(originalName, prefix = 'uploads') {
    const extension = originalName.split('.').pop()
    const timestamp = Date.now()
    const randomId = uuidv4().substring(0, 8)
    return `${prefix}/${timestamp}-${randomId}.${extension}`
  }

  // 上传文件到阿里云OSS
  async uploadToAliOSS(fileBuffer, fileName, options = {}) {
    try {
      const oss = this.initAliOSS()
      const result = await oss.put(fileName, fileBuffer, options)
      return {
        success: true,
        url: result.url,
        fileName: fileName,
        provider: 'aliyun'
      }
    } catch (error) {
      console.error('阿里云OSS上传失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 上传文件到腾讯云COS
  async uploadToTencentCOS(fileBuffer, fileName, options = {}) {
    return new Promise((resolve, reject) => {
      const cos = this.initTencentCOS()
      cos.putObject({
        Bucket: process.env.TENCENT_COS_BUCKET,
        Region: process.env.TENCENT_COS_REGION,
        Key: fileName,
        Body: fileBuffer,
        ...options
      }, (err, data) => {
        if (err) {
          console.error('腾讯云COS上传失败:', err)
          resolve({ success: false, error: err.message })
        } else {
          const url = `https://${data.Location}`
          resolve({
            success: true,
            url: url,
            fileName: fileName,
            provider: 'tencent'
          })
        }
      })
    })
  }

  // 通用上传方法
  async uploadFile(fileBuffer, originalName, prefix = 'uploads') {
    const fileName = this.generateFileName(originalName, prefix)
    
    try {
      let result
      if (this.currentProvider === 'tencent') {
        result = await this.uploadToTencentCOS(fileBuffer, fileName)
      } else {
        result = await this.uploadToAliOSS(fileBuffer, fileName)
      }
      
      return result
    } catch (error) {
      console.error('文件上传失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 删除文件
  async deleteFile(fileName, provider = null) {
    const currentProvider = provider || this.currentProvider
    
    try {
      if (currentProvider === 'tencent') {
        const cos = this.initTencentCOS()
        return new Promise((resolve) => {
          cos.deleteObject({
            Bucket: process.env.TENCENT_COS_BUCKET,
            Region: process.env.TENCENT_COS_REGION,
            Key: fileName
          }, (err, data) => {
            if (err) {
              resolve({ success: false, error: err.message })
            } else {
              resolve({ success: true })
            }
          })
        })
      } else {
        const oss = this.initAliOSS()
        await oss.delete(fileName)
        return { success: true }
      }
    } catch (error) {
      console.error('文件删除失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 获取文件列表
  async listFiles(prefix = '', maxKeys = 100) {
    try {
      if (this.currentProvider === 'tencent') {
        const cos = this.initTencentCOS()
        return new Promise((resolve) => {
          cos.getBucket({
            Bucket: process.env.TENCENT_COS_BUCKET,
            Region: process.env.TENCENT_COS_REGION,
            Prefix: prefix,
            MaxKeys: maxKeys
          }, (err, data) => {
            if (err) {
              resolve({ success: false, error: err.message })
            } else {
              resolve({ success: true, files: data.Contents })
            }
          })
        })
      } else {
        const oss = this.initAliOSS()
        const result = await oss.list({
          prefix: prefix,
          'max-keys': maxKeys
        })
        return { success: true, files: result.objects }
      }
    } catch (error) {
      console.error('获取文件列表失败:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new StorageService()