approximort
===========

Use [morton numbers][1] as [leveldb][2] keys, as a fast, rough, range-queryable, geospatial lookup.

**WARNING - EXPERIMENTAL - DO NOT EAT**

For more considered geospatial indexing in level, **see [level-geo][6]**

## The idea
**Morton numbers** flatten 2 dimensional points `[x,y]` to 1 dimensional, integers `[z]`, and **maintain locality**.
If the the morton for your 2d position is numerically close to some other morton, then those 2 points are near each other in the 2d space.

**Leveldb** keeps it's keys sorted, and allows simple range queries.
Using morton numbers as keys means that keys next to each other in the db correspond to things near each other in 2d space.
Leveldb is quite happy to provide ranges of values near a desired key.

The net result: **Find _"what are the things near me"_ with no extra magic, and as fast as level can look up a key, which is pretty fast.**

## Sorting in level
Leveldb keys are strings and the auto-sorting magic is alphabetic.
Morton numbers are integers, and locality preserving goodness is only usable if they are sorted numerically.
So we encode the numeric keys with [bytewise][3]; mapping the numbers to fixed length byte strings, that when ascii-sorted, will also be numerically sorted.

## Do not eat
This is a sketch of an idea. It's a guesstimation of nearness. A roughtimate at best.

The algorithm for morton basically packs out the 2d plane with ever smaller [z-curves][4].
Locality is maintained but not perfectly uniform. so we can say _x is near y_ but we cannot say that _x is definitely the nearest thing to y_.

Trading off accuracy for speed is usually not super useful, because Moore's Law.
Other packing formulea like [Hilbert][5] might work better, but I work empirically, so let's see...

Of note, the problem of **geospatial indexing for leveldb is solved in [level-geo][6]**, by maintaining an [rtree][7] index via [sublevel][8]

_The author exerts some ill-defined moral right to rename this to `mortify` in the future._

[1]: https://github.com/kkaefer/node-morton
[2]: https://github.com/rvagg/node-levelup
[3]: https://github.com/deanlandolt/bytewise
[4]: http://en.wikipedia.org/wiki/morton-numbers
[5]: ?
[6]: https://www.npmjs.org/package/level-geo
[7]: ?
[8]: ?
