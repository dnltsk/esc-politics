export type CountryProperties = {
  NAME: string;
  ISO_A2: CountryCode;
}

export const enum CountryCode {
  A99 = "-99",
  AL = "AL", AD = "AD", AM = "AM", AU = "AU", AT = "AT", AZ = "AZ", BY = "BY", BE = "BE", BA = "BA", BG = "BG", HR = "HR", CY = "CY", CZ = "CZ", DK = "DK", EE = "EE", FI = "FI", FR = "FR", GE = "GE", DE = "DE", GR = "GR", HU = "HU", IS = "IS", IE = "IE", IL = "IL", IT = "IT", LV = "LV", LT = "LT", LU = "LU", MT = "MT", MA = "MA", MD = "MD", MC = "MC", ME = "ME", NL = "NL", MK = "MK", NO = "NO", PL = "PL", PT = "PT", RO = "RO", RU = "RU", SM = "SM", RS = "RS", CS = "CS", SK = "SK", SI = "SI", ES = "ES", SE = "SE", CH = "CH", TR = "TR", UA = "UA", GB = "GB", YU = "YU",
}

export type PointDirection = "received" | "given"

export type EscTimeseries = {
  [key in string]?: EscYear
}

export type EscYear = {
  meta?: any,
  participants: CountryCode[],
  countries: CountryMap
}

export type CountryMap = {
  [key in CountryCode]?: CountryResult
}

export type CountryResult = {
  countryCode: CountryCode
  place: number
  points: number
  performer: string
  song: string
  completePointsReceived?: PointsReceivedMap
  juryPointsReceived?: PointsReceivedMap
  telePointsReceived?: PointsReceivedMap
}

export type PointsReceivedMap = {
  [key in CountryCode]?: number
}
