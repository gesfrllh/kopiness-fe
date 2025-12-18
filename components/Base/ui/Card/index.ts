import CardRoot from "./Card";
import CardImage from "./CardImage";
import CardContent from "./CardContent";
import CardTitle from "./CardTitle";
import CardPrice from "./CardPrice";
import CardFooter from "./CardFooter";

type CardCompound = typeof CardRoot & {
  image: typeof CardImage
  content: typeof CardContent
  title: typeof CardTitle
  price: typeof CardPrice
  footer: typeof CardFooter
}

(CardRoot as CardCompound).image = CardImage;
(CardRoot as CardCompound).content = CardContent;
(CardRoot as CardCompound).title = CardTitle;
(CardRoot as CardCompound).price = CardPrice;
(CardRoot as CardCompound).footer = CardFooter;

export default CardRoot as CardCompound;
