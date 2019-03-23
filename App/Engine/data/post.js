import {BaseData} from './baseData'

/**
 * Post - A container for a customer's post to their feed.
 *
 * @author Stealthy Inc.
 * @version 1.0
 *
 * @flow
 */
class Post extends BaseData {
  constructor() {
    super()
    const now = Date.now()
    this.data = {
      // A unique identifier for this post (TODO: consider UUID)
      id: now,
      time: {
        created: now,
        // An array of times this post has been edited
        edited: undefined,
      },
      content: {
        // An array of images for the post (uploaded to CDN and converted to
        // an array of URLs when posted).
        gallery: undefined,
        galleryUrls: undefined,
        // A movie for this post (uploaded to CDN and converted to a URL
        // when posted).
        movie: undefined,
        movieUrl: undefined,
        description: undefined
      },
      signatures: {
        // TODO: signatures of gallery images and/or movie (skipping that due to
        //       time and performance concerns--might make that an option).
        gallery: undefined,
        movie: undefined,
        description: undefined
      }
    }
  }

  /**
   * @param aCdnUrl
   */
  async uploadContentToCdn(aCdnUrl) {
    super.setModified()
    // TODO: inspect for content and push it up to the CDN, for now, just wipe
    //       out the gallery & movie obj to prevent pushing binaries to the db
    if (this.data.content.gallery) {
      this.data.content.gallery = undefined
      this.data.content.galleryUrls = ['https://www.stealthy.im/c475af8f31e17be88108057f30fa10f4.png']
    }
    if (this.data.content.movie) {
      this.data.content.movie = undefined
      this.data.content.movieUrl = ['https://www.youtube.com/watch?v=4rLdMIrVBrw']
    }

    // TODO:
  }

  /**
   * @param anImage
   */
  addImage(anImage) {
    super.setModified()

    if (!this.data.content.gallery) {
      this.data.content.gallery = []
    }
    this.data.content.gallery.push(anImage)
  }

  /**
   * @param aMovie
   */
  setMovie(aMovie) {
    super.setModified()

    this.data.content.movie = aMovie
  }

  /**
   * @param aDescription
   */
  setDescription(aDescription) {
    super.setModified()

    this.data.content.description = aDescription
  }
}

module.exports = { Post }
