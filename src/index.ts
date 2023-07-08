import chalk from "chalk";
import { Command } from "commander";
import { APILiveEdit } from "./api-liveedit";
import { Entries, Entry } from "./api-liveedit-types";

import { executeShot, getCompiledShots } from "./viz/viz";
import { initLtcManager, onLTC } from "./lib-ltc";
import {
  getAudioDevices,
  printAudioDevices,
  validAudioDevice,
} from "./printAudioDevices";
import Debug from "./utils/debug";
import { Shot } from "./viz/types";
import { msToTc } from "./utils/msToTc";
const figlet = require("figlet");
const debug = Debug("CORE");

const program = new Command();

type SongTitle = string;

const queue: SongTitle[] = [];
const inFlight: SongTitle[] = [];
let liveeditData: Entries;

const fetchLiveEditData = async () => {
  const data: Entries | Error = await APILiveEdit.fetchData();
  if (data instanceof Error) {
    debug(chalk.redBright("Error fetching data from LiveEdit"));
    process.exit(1);
  }
  liveeditData = data;
};

console.log(figlet.textSync("ArtFS"));

program
  .version("1.0.0")
  .description("A CLI for to play back cameras from LiveEdit to ArtNet")
  .option("-e, --emitRandom <emitRandom>", "Emit Random Artnet-Data")
  .option("-s, --subNet <subNet>", "Artnet Subnet")
  .option("-u, --universe <universe>", "Artnet Universe")
  .option("-n, --net <net>", "Artnet Net")
  .parse(process.argv);

const options = program.opts();

var dmxlib = require("dmxnet");

var dmxnet = new dmxlib.dmxnet({
  log: { level: "info" }, // Winston logger options
  oem: 0, // OEM Code from artisticlicense, default to dmxnet OEM.
  esta: 0, // ESTA Manufacturer ID from https://tsp.esta.org, default to ESTA/PLASA (0x0000)
  sName: "Text", // 17 char long node description, default to "dmxnet"
  lName: "Long description", // 63 char long node description, default to "dmxnet - OpenSource ArtNet Transceiver"
  //  hosts: ["127.0.0.1"], // Interfaces to listen to, all by default
});

if (options.emitRandom) {
  const sender = dmxnet.newSender({
    subnet: 0, //Source subnet, default 0
    universe: 0, //Source universe, default 0
    net: 0, //Source net, default 0
    ip: "127.0.0.1",
  });

  setInterval(() => {
    sender.fillChannels(0, 100, Math.random() * 255);
  }, 2000);
}

var receiver = dmxnet.newReceiver({
  subnet: options.subNet || 0, //Destination subnet, default 0
  universe: options.universe || 0, //Destination universe, default 0
  net: options.net || 0, //Destination net, default 0
});

const oldValues: { [keys: string]: any } = {};

receiver.on("data", (data: number[]) => {
  console.log("DMX data:", data);
  const values = data;
  for (const key in values) {
    if (values.hasOwnProperty(key)) {
      const value = values[key];
      if (value !== oldValues[key]) {
        handleValueChange(key, value);
        oldValues[key] = value;
      }
    }
  }
});

import fetch from "node-fetch";
const handleValueChange = (key: string, dmxValue: number) => {
  const channel = channels.find((c) => c.ch === parseInt(key));

  if (channel) {
    const { param } = channel;
    let ajaValue;
    if (dmxValue === 127) {
      ajaValue = channel.default;
    }
    if (dmxValue < 127) {
      // 0-127
      const min = channel.min;
      const max = channel.default;
      const range = max - min;
      const percentage = dmxValue / 127;
      ajaValue = min + range * percentage;
    }
    if (dmxValue > 127) {
      // 127-255
      const min = channel.default;
      const max = channel.max;
      const range = max - min;
      const percentage = (dmxValue - 127) / 127;
      ajaValue = min + range * percentage;
    }

    fetch(
      `http://192.168.10.40:80/config?action=set&paramid=${param}&value=${ajaValue}`
    );
  }
};

const channels: {
  ch: number;
  name: string;
  param: string;
  min: number;
  max: number;
  default: number;
}[] = [
  {
    ch: 0,
    name: "Master Gain",
    param: "eParamID_TV_Vid1MasterGain",
    min: 0,
    max: 3000,
    default: 1000,
  },
  {
    ch: 1,
    name: "Red Gain",
    param: "eParamID_TV_Vid1RedGain",
    min: 0,
    max: 3000,
    default: 1000,
  },
  {
    ch: 2,
    name: "Green Gain",
    param: "eParamID_TV_Vid1GreenGain",
    min: 0,
    max: 3000,
    default: 1000,
  },
  {
    ch: 3,
    name: "Blue Gain",
    param: "eParamID_TV_Vid1BlueGain",
    min: 0,
    max: 3000,
    default: 1000,
  },
  {
    ch: 4,
    name: "Saturation",
    param: "eParamID_TV_Vid1HDRSaturation",
    min: 0,
    max: 2000,
    default: 1000,
  },

  {
    ch: 5,
    name: "Master Lift",
    param: "eParamID_TV_Vid1MasterLift",
    min: -1000,
    max: 1000,
    default: 0,
  },
  {
    ch: 6,
    name: "Red Lift",
    param: "eParamID_TV_Vid1RedLift",
    min: -1000,
    max: 1000,
    default: 0,
  },
  {
    ch: 7,
    name: "Green Lift",
    param: "eParamID_TV_Vid1GreenLift",
    min: -1000,
    max: 1000,
    default: 0,
  },
  {
    ch: 8,
    name: "Blue Lift",
    param: "eParamID_TV_Vid1BlueLift",
    min: -1000,
    max: 1000,
    default: 0,
  },
  {
    ch: 9,
    name: "Master Gamma",
    param: "eParamID_TV_Vid1MasterGamma",
    min: 0,
    max: 2000,
    default: 1000,
  },
  {
    ch: 10,
    name: "Red Gamma",
    param: "eParamID_TV_Vid1RedGamma",
    min: 0,
    max: 2000,
    default: 1000,
  },
  {
    ch: 11,
    name: "Green Gamma",
    param: "eParamID_TV_Vid1GreenGamma",
    min: 0,
    max: 2000,
    default: 1000,
  },
  {
    ch: 12,
    name: "Blue Gamma",
    param: "eParamID_TV_Vid1BlueGamma",
    min: 0,
    max: 2000,
    default: 1000,
  },
];

debug("Channels");
channels.forEach((ch) =>
  debug(
    chalk.blue(ch.ch),
    chalk.green(ch.name),
    chalk.yellow(ch.min),
    chalk.magenta(ch.default),
    chalk.red(ch.max),
    chalk.gray(ch.param)
  )
);

const init = async () => {
  debug("Running...");
};

init();
