import { Settings } from "./settings";
import setWidgetBackground from "./setWidgetBackground";
import buildCalendarView from "./buildCalendarView";
import buildEventsView from "./buildEventsView";
import getEvents from "./getEvents";
import buildLargeWidget from "./buildLargeWidget";

async function buildWidget(settings: Settings): Promise<ListWidget> {
  const widget = new ListWidget();
  widget.backgroundColor = new Color(settings.widgetBackgroundColor, 1);
  setWidgetBackground(widget, settings.backgroundImage);
  widget.setPadding(16, 16, 16, 16);

  const start_day = new Date();
  // layout horizontally
  const globalStack = widget.addStack();

  const events = await getEvents(start_day, settings);

  switch (config.widgetFamily) {
    case "small":
      if (settings.widgetType === "events") {
        await buildEventsView(events, globalStack, settings);
      } else {
        await buildCalendarView(start_day, globalStack, settings);
      }
      break;
    case "large":
      await buildLargeWidget(start_day, events, globalStack, settings);
      break;
    default:
      if (settings.twoColumnsEvents) {
        start_day.setDate(start_day.getDate() + 1);
        const events = await getEvents(start_day, settings);
        await buildEventsView(events, globalStack, settings, {"eventLimit": 3});
        globalStack.addSpacer(5);
        await buildEventsView(events.slice(3), globalStack, settings);
      } else {
        if (settings.flipped) {
          await buildCalendarView(start_day, globalStack, settings);
          globalStack.addSpacer(10);
          await buildEventsView(events, globalStack, settings);
        } else {
          await buildEventsView(events, globalStack, settings);
          await buildCalendarView(start_day, globalStack, settings);
        }
      }
      break;
  }

  return widget;
}

export default buildWidget;
