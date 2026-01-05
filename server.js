const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== FILE SETUP ===== */
const DATA_DIR = path.join(__dirname, "data");
const LOG_FILE = path.join(DATA_DIR, "logs.json");

const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "51.38.205.167",
  user: "u8308_Qm5Dxh5oda",
  password: "hrlZLv@tk7c2jo0LMjNuK.DT",
  database: "s8308_testserver",
  waitForConnections: true,
  connectionLimit: 5
});
const VEHICLE_NAMES = [
  "Lexus rs330",                // 400
  "Aston Martin Vanquish",      // 401
  "Chevrolet Camaro",           // 402
  "Linerunner",                 // 403
  "Benz cla 45 amg",            // 404
  "Audi rs",                    // 405
  "Dumper",                     // 406
  "Firetruck",                  // 407
  "Trashmaster",                // 408
  "Stretch",                    // 409
  "Audi r8",                    // 410
  "2020 Lamborghini Huracan Evo",// 411
  "Mercedes-Benz SLK350",       // 412
  "Pony",                       // 413
  "Mercedes-Benz Sprinter",     // 414
  "Lamborghini SV Roadster",    // 415
  "Ambulance",                  // 416
  "Leviathan",                  // 417
  "Mercedes-Benz v-class",      // 418
  "bmw e30",                    // 419
  "Taxi",                       // 420
  "Mercedes-Benz C63 W20",      // 421
  "TOYOTA HILUX",               // 422
  "Whoopee",                    // 423
  "KMT",                        // 424
  "Hunter",                     // 425
  "bmw m5 f10",                 // 426
  "Enforcer",                   // 427
  "Securicar",                  // 428
  "Ferrari 458",                // 429
  "Predator",                   // 430
  "Bus",                        // 431
  "ARMY",                       // 432
  "Barracks",                   // 433
  "Mercedes Benz vision avtr",  // 434
  "Article Trailer",            // 435
  "Previon",                    // 436
  "Coach",                      // 437
  "Cabbie",                     // 438
  "Rolls Royce DAW",            // 439
  "Rumpo",                      // 440
  "RC Bandit",                  // 441
  "Alphard Hybrid",             // 442
  "Packer",                     // 443
  "Monster",                    // 444
  "bmw x6",                     // 445
  "Squalo",                     // 446
  "Seasparrow",                 // 447
  "Pizzaboy",                   // 448
  "Tram",                       // 449
  "Article Trailer 2",          // 450
  "Bugatti chirio",             // 451
  "Speeder",                    // 452
  "Reefer",                     // 453
  "Tropic",                     // 454
  "Flatbed",                    // 455
  "Yankee",                     // 456
  "Caddy",                      // 457
  "Toyota Corolla",             // 458
  "Berkley's RC Van",           // 459
  "Skimmer",                    // 460
  "PCJ-600",                    // 461
  "Faggio",                     // 462
  "Freeway",                    // 463
  "RC Baron",                   // 464
  "RC Raider",                  // 465
  "Range Rover SVR",            // 466
  "McLean",                     // 467
  "Sanchez",                    // 468
  "Sparrow",                    // 469
  "Patriot",                    // 470
  "Quad",                       // 471
  "Coastguard",                 // 472
  "Dinghy",                     // 473
  "Koenigsegg Agera",           // 474
  "Dodge Challenger",           // 475
  "Rustler",                    // 476
  "Chevrolet Corvette",         // 477
  "Walton",                     // 478
  "Mercedes-Benz BRABUS",       // 479
  "Rolls-Royce Wraith",         // 480
  "BMX",                        // 481
  "Toyota hiace",               // 482
  "Toyota Hiace Super",         // 483
  "Marquis",                    // 484
  "Baggage",                    // 485
  "Dozer",                      // 486
  "Maverick",                   // 487
  "News Chopper",               // 488
  "G WAGON G63",                // 489
  "FBI Rancher",                // 490
  "bmw m8",                     // 491
  "Volkswagen Polo",            // 492
  "Jetmax",                     // 493
  "Hotring",                    // 494
  "Sandking",                   // 495
  "Lexus lc500",                // 496
  "Police Maverick",            // 497
  "Boxville",                   // 498
  "Benson",                     // 499
  "Ford TFZ-P1",                // 500
  "RC Goblin",                  // 501
  "Hotring Racer A",            // 502
  "Hotring Racer B",            // 503
  "Bloodring Banger",           // 504
  "GLE 63",                     // 505
  "Pagani Zonda",               // 506
  "Volvo Polestar 1",           // 507
  "Journey",                    // 508
  "Bike",                       // 509
  "Mountain Bike",              // 510
  "Beagle",                     // 511
  "Cropduster",                 // 512
  "Stuntplane",                 // 513
  "Tanker",                     // 514
  "Roadtrain",                  // 515
  "Volvo XC90",                 // 516
  "bmw i8",                     // 517
  "bmw m1 drift",               // 518
  "Shamal",                     // 519
  "Hydra",                      // 520
  "FCR-900",                    // 521
  "NRG-500",                    // 522
  "HPV1000",                    // 523
  "Cement Truck",               // 524
  "Tow Truck",                  // 525
  "Amg c63",                    // 526
  "Arrinera Hussarya",          // 527
  "SWAT Truck",                 // 528
  "Porsche Cayenne",            // 529
  "Forklift",                   // 530
  "Tractor",                    // 531
  "Combine",                    // 532
  "Benz sl500",                 // 533
  "Toyota supra",               // 534
  "Slamvan",                    // 535
  "Blade",                      // 536
  "Streak",                     // 537
  "Freight",                    // 538
  "Vortex",                     // 539
  "c300",                       // 540
  "Nissan GTR",                 // 541
  "Porsche 911",                // 542
  "Tesla cybertruck",           // 543
  "Firetruck",                  // 544
  "Hustler",                    // 545
  "Lexus GS35",                 // 546
  "Primo",                      // 547
  "Cargobob",                   // 548
  "Lexus LFA",                  // 549
  "Lexus lc200",                // 550
  "Audi rs q8",                 // 551
  "Utility",                    // 552
  "Nevada",                     // 553
  "2023 Ford Raptor F150",      // 554
  "Bentley Continental GT",     // 555
  "Monster",                    // 556
  "Monster",                    // 557
  "Tesla Roadster",             // 558
  "bmw m4",                     // 559
  "Bentley Bentayga",           // 560
  "jeep Trackhawk",             // 561
  "Honda NSX",                  // 562
  "Raindance",                  // 563
  "RC Tiger",                   // 564
  "kia k5",                     // 565
  "Dodge Charger SRT Hellcat",  // 566
  "Lexus is",                   // 567
  "Bandito",                    // 568
  "Freight Flat",               // 569
  "Streak Carriage",            // 570
  "Kart",                       // 571
  "Mower",                      // 572
  "Dune",                       // 573
  "Sweeper",                    // 574
  "Broadway",                   // 575
  "Benz s63 Coupe",             // 576
  "AT-400",                     // 577
  "DFT-30",                     // 578
  "Lamborghini urus",           // 579
  "Rolls-Royce Cullinan",       // 580
  "BF-400",                     // 581
  "News Van",                   // 582
  "Tug",                        // 583
  "Petrol Trailer",             // 584
  "Mercedes-Benz AMG GT63s",    // 585
  "Wayfarer",                   // 586
  "Lexus rs",                   // 587
  "Hotdog",                     // 588
  "Mercedes-Benz W222",         // 589
  "Freight Box",                // 590
  "Article Trailer 3",          // 591
  "Andromada",                  // 592
  "Dodo",                       // 593
  "RC Cam",                     // 594
  "Launch",                     // 595
  "LSPD Car",                   // 596
  "SFPD Car",                   // 597
  "LVPD Car",                   // 598
  "Police Rancher",             // 599
  "Picador",                    // 600
  "S.W.A.T",                    // 601
  "Alpha",                      // 602
  "Phoenix",                    // 603
  "Glendale",                   // 604
  "Sadler",                     // 605
  "Luggage",                    // 606
  "Luggage",                    // 607
  "Stairs",                     // 608
  "Boxville",                   // 609
  "Tiller",                     // 610
  "Utility Trailer"             // 611
];

/* Ensure data folder + file exist */
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ===== HELPERS ===== */
function readLogs() {
  try {
    const data = fs.readFileSync(LOG_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

/* ===== ROUTES ===== */

/* Health check */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* GET logs */
app.get("/logs", (req, res) => {
  const logs = readLogs();
  res.json(logs);
});

/* POST new log */
app.post("/logs", (req, res) => {
  const { type, author, message } = req.body;

  if (!type || !author || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const logs = readLogs();

  const newLog = {
    type,
    author,
    message,
    timestamp: Date.now()
  };

  logs.unshift(newLog);
  writeLogs(logs);

  res.json({ success: true });
});

/* PLAYER LOOKUP — ADD HERE */
app.get("/player/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const [rows] = await db.query(
  `
  SELECT
    u.username,
    u.faction,
    u.factionrank,
    u.level,
    u.hours,
    u.cash,
    u.bank,
    u.bank_balance,
    f.name AS faction_name
  FROM users u
  LEFT JOIN factions f ON f.id = u.faction
  WHERE u.username = ?
  LIMIT 1
  `,
  [name]
);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const player = rows[0];

    res.json({
  username: player.username,
  faction_id: player.faction,
  faction_name: player.faction_name,
  factionrank: player.factionrank,
  level: player.level,
  hours: player.hours,
  cash: player.cash,
  bank: player.bank,
  fleeca: player.bank_balance
});
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ===== PLAYER VEHICLES =====
app.get("/player/:name/vehicles", async (req, res) => {
  const name = req.params.name;

  try {
    const [rows] = await db.query(
      `
      SELECT modelid, tickets
      FROM vehicles
      WHERE owner = ?
      `,
      [name]
    );

    // 👇 THIS IS WHERE YOUR CODE GOES
    res.json(
      rows.map(v => {
        const index = v.modelid - 400;

        return {
          modelid: v.modelid,
          name: VEHICLE_NAMES[index] || `Model ${v.modelid}`,
          tickets: v.tickets
        };
      })
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/player/:name/businesses", async (req, res) => {
  const name = req.params.name;

  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        price,
        type,
        locked
      FROM businesses
      WHERE owner = ?
      `,
      [name]
    );

    res.json(rows);
  } catch (err) {
    console.error("BUSINESSES ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/player/:name/houses", async (req, res) => {
  const name = req.params.name;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        id,
        price,
        level,
        locked
      FROM houses
      WHERE owner = ?
      `,
      [name]
    );

    res.json(rows);
  } catch (err) {
    console.error("HOUSES ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* ===== ECONOMY ===== */
app.get", async (req, res) => {
  try {
    // 1️⃣ Total player circulation (cash + bank)
    const [[circulation]] = await db.query(`
      SELECT
        SUM(cash + bank + bank_balance) AS total
      FROM users
    `);

    // 2️⃣ Government / businesses money
    const [[government]] = await db.query(`
      SELECT
        SUM(cash) AS total
      FROM businesses
    `);

    // TEMP placeholders (until we add history table)
    const yesterday = circulation.total * 1.997; // fake but consistent
    const sevenDaysAgo = 0;

    res.json({
      total: circulation.total || 0,
      yesterday: Math.floor(yesterday || 0),
      sevenDaysAgo,
      government: government.total || 0
    });

  } catch (err) {
    console.error("Economy error:", err);
    res.status(500).json({ error: "Economy load failed" });
  }
});
/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
