# S-Rank reports

## Use the panel

1. Restart the bot after updating its files.
2. In the server's configured S-Rank report channel, run /s-rank-panel.
   Posting the panel requires Manage Messages; submitting a report does not.
3. Choose one of the six expansion buttons.
4. Select a hunt from the Name | Location dropdown and enter coordinates or ToD.
   Leave the optional text input blank if you only know the zone.
5. Submit. The bot sends a red report embed to the manual report destination,
   mentions the configured notification role and reporter, and confirms privately.

Coordinates or ToD is free text, without numeric or format validation.
Discord's standard text-input length limit still applies.

## Data and configuration

- src/util/huntVariables.json: 47 regular S-Ranks, grouped by expansion.
  This contains the 17 A Realm Reborn marks and six marks per later expansion.
  Follow-on SS marks are excluded, matching the six-option Dawntrail design.
- src/util/idVariables.json: existing per-server configuration.
  guild.id identifies the server, channels.srankreports is the panel channel,
  channels.manualreports is the destination, and roles.manualreports is pinged.
  Both existing configured servers are supported automatically.
- src/util/sRankReports.js: shared builders, configuration lookup, and permission checks.
- src/commands/srankpanel.js: panel setup command.
- src/interaction-handlers/s-rank-expansion.js: expansion buttons open the form.
- src/interaction-handlers/report.js: form submissions send the report.

The bot needs View Channel and Send Messages in the panel channel, plus
Embed Links in the destination. The notification role must be mentionable,
or the bot needs Mention Everyone in that destination.
The existing Dawntrail custom emoji is preserved.

This feature does not require Guild Members, Guild Presences, or Message Content
privileged intents. It uses interaction-provided user information and field values.
The member request is only fetchMe() for the bot's own channel permissions;
it does not enumerate server members or rely on a member cache.
It does not add message or presence listeners, or change other bot features.

## Development

discord.js is pinned to 14.25.1 because the modals use label components and
string-select fields. The installed version already matches this requirement.

Run npm run test:s-rank for the offline tests. These validate the catalog and
payload sizes, all six interaction flows, both configured destinations, free-text
coordinates, scoped mentions, permission failures, and concurrent users.
They mock Discord requests and do not log in or send real messages.

Hunt names and locations were checked against:
https://ffxiv.consolegameswiki.com/wiki/Elite_Marks
