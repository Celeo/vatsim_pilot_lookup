import {
  getTransceiversData,
  getV3Data,
  Pilot,
  TransceiverResponseEntry,
  Vatsim,
} from "./deps.ts";

/**
 * Query the VATSIM API for current data.
 *
 * Sort the returned list of pilots.
 */
export async function getOnlinePilots(vatsim: Vatsim): Promise<Array<string>> {
  const data = await getV3Data(vatsim);
  const callsigns = data.pilots.map((p) => p.callsign);
  callsigns.sort((a, b): number => {
    const aS = a.toLowerCase();
    const bS = b.toLowerCase();
    return aS < bS ? -1 : aS > bS ? 1 : 0;
  });
  return callsigns;
}

/**
 * Get information for a pilot.
 */
export async function getPilotInformation(
  vatsim: Vatsim,
  callsign: string,
): Promise<{ flightInfo: Pilot; radioInfo: TransceiverResponseEntry }> {
  const v3Data = await getV3Data(vatsim);
  const transceiverData = await getTransceiversData(vatsim);
  const flightInfo = v3Data.pilots.find((pilot) => pilot.callsign === callsign);
  const radioInfo = transceiverData.find((entry) =>
    entry.callsign === callsign
  );
  if (flightInfo === undefined || radioInfo === undefined) {
    throw new Error(`Pilot callsign not found`);
  }
  return { flightInfo, radioInfo };
}
