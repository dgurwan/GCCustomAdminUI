export interface triggerModel {
  id: string,
  name: string,
  topicName: string,
  target: {
    type: string,
    id: string
  },
  version: number,
  enabled: boolean,
  matchCriteria:[
     {
        jsonPath: string,
        operator: string,
        value: string
     }
  ],
  selfUri: string
}
