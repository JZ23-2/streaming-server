export class CreateStreamHistoryDto {
  /**
   * @param {string} streamHistoryStreamID
   * @param {string} hostPrincipalID
   * @param {string} videoUrl
   */
  constructor(streamHistoryStreamID, hostPrincipalID, videoUrl) {
    this.streamHistoryStreamID = streamHistoryStreamID;
    this.hostPrincipalID = hostPrincipalID;
    this.videoUrl = videoUrl;
  }
}
