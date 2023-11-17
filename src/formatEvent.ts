import addWidgetTextLine from "./addWidgetTextLine";
import formatTime from "./formatTime";
import getSuffix from "./getSuffix";
import getEventIcon from "getEventIcon";
import getWeekLetters from "./getWeekLetters";
import { Settings } from "./settings";

/**
 * Adds a event name along with start and end times to widget stack
 *
 */
function formatEvent(
  stack: WidgetStack,
  event: CalendarEvent,
  {
    eventDateTimeOpacity,
    textColor,
    showCalendarBullet,
    showCompleteTitle,
    locale,
    startWeekOnSunday = false,
  }: Partial<Settings>
): void {
  const eventLine = stack.addStack();

  if (showCalendarBullet) {
    // show calendar bullet in front of event name
    const icon = getEventIcon(event);
    addWidgetTextLine(icon, eventLine, {
      textColor: event.calendar.color.hex,
      font: Font.mediumSystemFont(17),
      lineLimit: showCompleteTitle ? 0 : 1,
    });
  }

  // event title
  addWidgetTextLine(event.title, eventLine, {
    textColor,
    font: Font.mediumSystemFont(12),
    opacity: 0.8,
    lineLimit: showCompleteTitle ? 0 : 1,
  });
  // event duration
  let time: string;
  if (event.isAllDay) {
    time = "All Day";
  } else {
    time = `${formatTime(event.startDate)}-${formatTime(event.endDate)}`;
  }

  const date = new Date();
  const today = date.getDate();
  const tomorrow = new Date(date.setDate(date.getDate() + 1)).getDate();
  const eventDate = event.startDate.getDate();

  let eventDateStr: string;
  if (eventDate == tomorrow) {
    eventDateStr = "Завтра";
  } else {
    eventDateStr = event.startDate.toLocaleDateString(
      locale,
      {weekday: "short", day: "numeric", month: "short"},
    );
  }

  // if a future event is not today, we want to show it's date
  if (eventDate !== today) {
    time = `${eventDateStr} ${time}`;
  }

  // event time
  addWidgetTextLine(time, stack, {
    textColor,
    opacity: eventDateTimeOpacity,
    font: Font.regularSystemFont(11),
  });
}
export default formatEvent;
