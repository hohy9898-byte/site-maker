export async function loadData() {

  const stay = await fetch("/data/부산_숙박.json");
  const festival = await fetch("/data/부산_축제공연행사.json");
  const tour = await fetch("/data/부산_관광지.json");
  const leisure = await fetch("/data/부산_레포츠.json");
  const culture = await fetch("/data/부산_문화시설.json");
  const shopping = await fetch("/data/부산_쇼핑.json");
  const course = await fetch("/data/부산_여행코스.json");

  return {
    stay: await stay.json(),
    festival: await festival.json(),
    tour: await tour.json(),
    leisure: await leisure.json(),
    culture: await culture.json(),
    shopping: await shopping.json(),
    course: await course.json()
  };

}