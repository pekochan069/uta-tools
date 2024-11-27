import * as m from "~/paraglide/messages";

export enum UnitCategoryType {
  Length = "Length",
  Area = "Area",
  Volume = "Volume",
  Mass = "Mass",
  Speed = "Speed",
  Temperature = "Temperature",
  Time = "Time",
  Force = "Force",
  Energy = "Energy",
  Pressure = "Pressure",
  Torque = "Torque",
  Data = "Data",
  Angle = "Angle",
}

export enum UnitLength {
  Kilometer = "Kilometer",
  Meter = "Meter",
  Centimeter = "Centimeter",
  Millimeter = "Millimeter",
  Micrometer = "Micrometer",
  Mile = "Mile",
  Yard = "Yard",
  Foot = "Foot",
  Inch = "Inch",
  NauticalMile = "NauticalMile",
  PlanckLength = "PlanckLength",
  Parsec = "Parsec",
  AstronomicalUnit = "AstronomicalUnit",
  LightYear = "LightYear",
}

export enum UnitArea {
  SquareMeter = "SquareMeter",
  SquareKilometer = "SquareKilometer",
  SquareCentimeter = "SquareCentimeter",
  SquareMillimeter = "SquareMillimeter",
  SquareMile = "SquareMile",
  SquareYard = "SquareYard",
  SquareFoot = "SquareFoot",
  SquareInch = "SquareInch",
  Hectare = "Hectare",
  Acre = "Acre",
  SquareNauticalMile = "SquareNauticalMile",
  Pyeong = "Pyeong",
}

export enum UnitVolume {
  CubicMeter = "CubicMeter",
  CubicKilometer = "CubicKilometer",
  CubicCentimeter = "CubicCentimeter",
  CubicMillimeter = "CubicMillimeter",
  Liter = "Liter",
  KiloLiter = "KiloLiter",
  Milliliter = "Milliliter",
  Gallon = "Gallon",
  Quart = "Quart",
  Pint = "Pint",
  Cup = "Cup",
  Barrel = "Barrel",
  FluidOunce = "FluidOunce",
  Tablespoon = "Tablespoon",
  Teaspoon = "Teaspoon",
  CubicYard = "CubicYard",
  CubicFoot = "CubicFoot",
  CubicInch = "CubicInch",
}

export enum UnitMass {
  Kilogram = "Kilogram",
  Gram = "Gram",
  Milligram = "Milligram",
  Microgram = "Microgram",
  MetricTon = "MetricTon",
  LongTon = "LongTon",
  ShortTon = "ShortTon",
  Pound = "Pound",
  Ounce = "Ounce",
  Carat = "Carat",
  AtomicMassUnit = "AtomicMassUnit",
}

export enum UnitSpeed {
  MeterPerSecond = "MeterPerSecond",
  KilometerPerHour = "KilometerPerHour",
  MilePerHour = "MilePerHour",
  FeerPerSecond = "FeerPerSecond",
  Knot = "Knot",
}

export enum UnitTemperature {
  Celsius = "Celsius",
  Fahrenheit = "Fahrenheit",
  Kelvin = "Kelvin",
}

export enum UnitTime {
  Second = "Second",
  Millisecond = "Millisecond",
  Microsecond = "Microsecond",
  Nanosecond = "Nanosecond",
  Minute = "Minute",
  Hour = "Hour",
  Day = "Day",
  Week = "Week",
  Month = "Month",
  Year = "Year",
  Decade = "Decade",
  Century = "Century",
}

export enum UnitForce {
  Giganewton = "Giganewton",
  Meganewton = "Meganewton",
  Kilonewton = "Kilonewton",
  Newton = "Newton",
  Milinewton = "Milinewton",
  MegaDyne = "MegaDyne",
  KiloDyne = "KiloDyne",
  Dyne = "Dyne",
  Milidyne = "Milidyne",
  TonForce = "TonForce",
  KilogramForce = "KilogramForce",
  GramForce = "GramForce",
  PoundForce = "PoundForce",
  OunceForce = "OunceForce",
}

export enum UnitEnergy {
  Joule = "Joule",
  Kilojoule = "Kilojoule",
  MegaJoule = "MegaJoule",
  GigaJoule = "GigaJoule",
  Calorie = "Calorie",
  Kilocalorie = "Kilocalorie",
  WattHour = "WattHour",
  KilowattHour = "KilowattHour",
  MegawattHour = "MegawattHour",
  GigawattHour = "GigawattHour",
  TerawattHour = "TerawattHour",
  Milielectronvolt = "Milielectronvolt",
  Electronvolt = "Electronvolt",
  Kiloelectronvolt = "KiloEelectronvolt",
  Megaelectronvolt = "Megaelectronvolt",
  Gigaelectronvolt = "Gigaelectronvolt",
  BritishThermalUnit = "BritishThermalUnit",
  USTherm = "USTherm",
  FootPound = "FootPound",
  horsepowerHour = "horsepowerHour",
  TNTTon = "TNTTon",
  KiloTNTTon = "KiloTNTTon",
  MegaTNTTon = "MegaTNTTon",
  GigaTNTTon = "GigaTNTTon",
}

export enum UnitPressure {
  Pascal = "Pascal",
  Kilopascal = "Kilopascal",
  Megapascal = "Megapascal",
  Gigapascal = "Gigapascal",
  Bar = "Bar",
  Millibar = "Millibar",
  Atmosphere = "Atmosphere",
  MillimeterOfMercury = "MillimeterOfMercury",
  InchOfMercury = "InchOfMercury",
  PoundPerSquareInch = "PoundPerSquareInch",
  Torr = "Torr",
}

export enum UnitTorque {
  NewtonMeter = "NewtonMeter",
  KilogramForceMeter = "KilogramForceMeter",
  PoundForceFoot = "PoundForceFoot",
  OunceForceInch = "OunceForceInch",
}

export enum UnitData {
  Bit = "Bit",
  Byte = "Byte",
  Kilobyte = "Kilobyte",
  Megabyte = "Megabyte",
  Gigabyte = "Gigabyte",
  Terabyte = "Terabyte",
  Petabyte = "Petabyte",
  Exabyte = "Exabyte",
  Zettabyte = "Zettabyte",
  Yottabyte = "Yottabyte",
  Kilobit = "Kilobit",
  Megabit = "Megabit",
  Gigabit = "Gigabit",
  Terabit = "Terabit",
  Petabit = "Petabit",
  Exabit = "Exabit",
  Zettabit = "Zettabit",
  Yottabit = "Yottabit",
  KibiByte = "KibiByte",
  MebiByte = "MebiByte",
  GibiByte = "GibiByte",
  TebiByte = "TebiByte",
  PebiByte = "PebiByte",
  ExbiByte = "ExbiByte",
  ZebiByte = "ZebiByte",
  YobiByte = "YobiByte",
}

export enum UnitAngle {
  Degree = "Degree",
  Radian = "Radian",
  Gradian = "Gradian",
  Minute = "Minute",
  Second = "Second",
  Turn = "Turn",
}

export type UnitType =
  | UnitLength
  | UnitArea
  | UnitVolume
  | UnitMass
  | UnitSpeed
  | UnitTemperature
  | UnitTime
  | UnitForce
  | UnitEnergy
  | UnitPressure
  | UnitTorque
  | UnitData
  | UnitAngle;

export type UnitCategory = {
  category: UnitCategoryType;
  label: string;
};

export type Unit = {
  type: UnitType;
  label: string;
};

export const units: UnitCategory[] = [
  {
    category: UnitCategoryType.Length,
    label: m.tools_converters_unit_length(),
  },
  {
    category: UnitCategoryType.Area,
    label: m.tools_converters_unit_area(),
  },
  {
    category: UnitCategoryType.Volume,
    label: m.tools_converters_unit_volume(),
  },
  {
    category: UnitCategoryType.Mass,
    label: m.tools_converters_unit_mass(),
  },
  {
    category: UnitCategoryType.Speed,
    label: m.tools_converters_unit_speed(),
  },
  {
    category: UnitCategoryType.Temperature,
    label: m.tools_converters_unit_temperature(),
  },
  {
    category: UnitCategoryType.Time,
    label: m.tools_converters_unit_time(),
  },
  {
    category: UnitCategoryType.Force,
    label: m.tools_converters_unit_force(),
  },
  {
    category: UnitCategoryType.Energy,
    label: m.tools_converters_unit_energy(),
  },
  {
    category: UnitCategoryType.Pressure,
    label: m.tools_converters_unit_pressure(),
  },
  {
    category: UnitCategoryType.Torque,
    label: m.tools_converters_unit_torque(),
  },
  {
    category: UnitCategoryType.Data,
    label: m.tools_converters_unit_data(),
  },
  {
    category: UnitCategoryType.Angle,
    label: m.tools_converters_unit_angle(),
  },
];

export const unitTypeOptions: UnitCategoryType[] = [
  UnitCategoryType.Length,
  UnitCategoryType.Area,
  UnitCategoryType.Volume,
  UnitCategoryType.Mass,
  UnitCategoryType.Speed,
  UnitCategoryType.Temperature,
  UnitCategoryType.Time,
  UnitCategoryType.Force,
  UnitCategoryType.Energy,
  UnitCategoryType.Pressure,
  UnitCategoryType.Torque,
  UnitCategoryType.Data,
  UnitCategoryType.Angle,
];
