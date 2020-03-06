export type CountryProperties = {
  NAME: string;
  ADM0_A3: string;
  ISO_A2: string;
  esc: AllPointsGivenTotimeseries
}

export const enum Country {
  AL = "AL", AD = "AD", AM = "AM", AU = "AU", AT = "AT", AZ = "AZ", BY = "BY", BE = "BE", BA = "BA", BG = "BG", HR = "HR", CY = "CY", CZ = "CZ", DK = "DK", EE = "EE", FI = "FI", FR = "FR", GE = "GE", DE = "DE", GR = "GR", HU = "HU", IS = "IS", IE = "IE", IL = "IL", IT = "IT", LV = "LV", LT = "LT", LU = "LU", MT = "MT", MA = "MA", MD = "MD", MC = "MC", ME = "ME", NL = "NL", MK = "MK", NO = "NO", PL = "PL", PT = "PT", RO = "RO", RU = "RU", SM = "SM", RS = "RS", CS = "CS", SK = "SK", SI = "SI", ES = "ES", SE = "SE", CH = "CH", TR = "TR", UA = "UA", GB = "GB", YU = "YU",
}

export type ResultsOf = {
  points: PointsGivenTo,
  places: PointsGivenTo
}

export type PointsGivenTo = {
  [key in Country]?: number
};

export type AllPointsGivenTo = {
  place?: number,
  sumPoints?: number,
  telePoints?: PointsGivenTo;
  juryPoints?: PointsGivenTo;
}

export type AllPointsGivenTotimeseries = {
  [key in string]?: AllPointsGivenTo
}

export type AllPointsGivenToCollection = {
  [key in Country]?: AllPointsGivenTotimeseries
}