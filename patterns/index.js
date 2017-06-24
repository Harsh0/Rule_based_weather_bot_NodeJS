//defining pattern according to regular expression, the pattern that has more values should be written upside,
//so that maximum entities could be fetched
const patternDict = [{
  pattern:'\\b(?<greeting>Hi|Hello|Hey)\\b',
  intent:'Hello'
},{
  pattern:'\\blike\\sin\\s\\b(?<city>.+)',
  intent:'CurrentWeather'
},{
  pattern:'\\bweather\\sin\\s\\b(?<city>.+)',
  intent:'CurrentWeather'
},{
  pattern:'\\b(bye|exit)\\b',
  intent:'Exit'
},{
  pattern:'\\b(?<weather>hot|cold|rain|rainy|sunny|snow|thunderstorm|windy|drizzle)\\b\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)\\b(?<time>day\\safter\\stomorrow|tomorrow|today)$',
  intent:'WeatherForecast'
},{
  pattern:'\\b(?<weather>hot|cold|rain|rainy|sunny|snow|thunderstorm|windy|drizzle)\\b\\s\\b(?<time>day\\safter\\stomorrow|tomorrow|today)\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)$',
  intent:'WeatherForecast'
}];

module.exports = patternDict;
