export interface RelationalFrameGraphConfig {
  combinatorialDictionary: { [key: string]: { [key: string]: string }; }
  mutualDictionary: { [key: string]: string },
  selfRelation: string,
  unknownRelation: string,
}
