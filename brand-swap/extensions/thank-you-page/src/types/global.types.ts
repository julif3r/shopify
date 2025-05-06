import { SharingNetwork } from "sharethis-reactjs";

export interface urlParams {
  position?: urlParamsPosition;
}

export enum UseFrom {
  none = "none",
  campaign = "campaign",
  offer = "offer",
}

export enum RedeemBy {
  webemail = "webemail",
  email = "email",
}

export enum DelayType {
  none = "none",
  minutes = "minutes",
  hours = "hours",
  days = "days",
  months = "months",
}

export enum ImageRepresentation {
  top = "top",
  left = "left",
  right = "right",
}

export enum LayoutDevices {
  desktop = "desktop",
  mobile = "mobile",
}

export enum Views {
  initial = "initial",
  main = "main",
}

export enum LayoutChildClass {
  button = "button",
  popup = "popup",
}

export enum urlParamsPosition {
  bottom = "bottom",
  left = "left",
  right = "right",
}

export enum DeviceType {
  desktop = "desktop",
  mobile = "mobile",
}

export enum ImageSize {
  all = "all",
  big = "300x300",
  medium = "200x200",
  small = "100x100",
}

export enum PlacementStage {
  pre = "pre",
  post = "post",
}

export enum LayoutType {
  embedded = "embedded",
  popup = "popup",
}

export enum CONDITION_OPERATORS_TEXT {
  in = "In",
  notIn = "Not In",
  equal = "Equal",
  notEqual = "Not Equal",
  contains = "Contains",
  notContains = "Not Contains",
}

export enum CONDITION_OPERATORS_AMOUNT {
  equal = "Equal",
  notEqual = "Not Equal",
  greaterThan = "Greater Than",
  greaterThanorEqual = "Greater Than Or Equal",
  lessThan = "Less Than",
  lessThanorEqual = "Less Than Or Equal",
}

export enum CONDITION_SEARCH_TYPE {
  text = "Text",
  amount = "Amount",
}

export enum CONDITION_SEARCH_LOCATION {
  none = "None",
  pageTitle = "Page Title",
  other = "Other",
}

export enum CONDITION_LOGICAL_OPERATORS {
  and = "and",
  or = "or",
}

export enum TemplateIcons {
  default = "default",
  custom = "custom",
}

export interface QueryParams {
  pageParams: {
    page: string;
  };
  contactDetails?: QuerySaveEmail[];
  selectedOffers?: string[];
  companyToken: string;
}

export interface QuerySaveEmail {
  offerid: string;
  email: string;
  offerLink: string;
  companyId: string;
  campaignId: string;
  templateId?: string;
  placementId: string;
  slot: number;
  pltype: PlacementStage;
  layoutId: string;
  orderId: string;
  delayMinutes?: number;
}
export interface ContactDetails {
  email: string;
  offerId: string;
  offerLink: string;
  placementId: string;
  placementName: string;
}

export interface QueryBundle {
  offerId: string;
  campaignId: string;
  placementId: string;
  orderId: string;
  userSessionId: string;
  imageUrl: string;
  pageUrl: string;
  templateId: string;
  placementName: string;
  pltype: PlacementStage;
  slot: number;
}


export interface QueryPostEmail {
  campaignId: string;
  campaignName: string;
  companyId: string;
  contactDetails: ContactDetails[];
  isAuto: boolean;
  offerIds: string[];
  placementId: string;
  placementName: string;
  templateId?: string;
  pltype: PlacementStage;
}

export interface QueryPostOfferView {
  offerIds?: string[];
  offers?: OffersIdSlots[];
  campaignId: string;
  campaignName: string;
  companyId: string;
  placementId: string;
  placementName: string;
  pageUrl: string;
  layoutId: string;
  templateId: string;
  pltype: PlacementStage;
}

export interface TrackingShare {
  offerid: string;
  offerLink: string;
  companyId: string;
  campaignId: string;
  campaignName: string;
  templateId: string;
  slot: number;
  placementId: string;
  placementName: string;
  pageUrl: string;
  shareType: string;
  orderId: string;
}

export interface TrackingParams {
  event: string;
  red?: string;
  campaignId?: string;
  offerId?: string;
  retailerId?: string;
  advertiserId?: string;
  placementId?: string;
  placementName?: string;
  tid?: string;
  slot?: number;
  pltype: PlacementStage;
  pltid: string;
}

export interface CampaignSharingOptions {
  allowSharing: boolean;
  shareAdvertiserOffer: boolean;
  shareMessage: string;
  sharingPlatforms: {
    platforms: SharingNetwork[];
  };
}

export interface CampaignType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  company_Id: string;
  startDate: string;
  endDate: string;
  campaignGeneralOptions: CampaignOptions;
  completionStatus: {
    status: boolean;
    next: CAMPAIGNSTEPS;
  };
  allowSharing: boolean;
  templateId: string;
  offerCount: number;
  templateSettings: LayoutSettings;
  sharingOptions: CampaignSharingOptions;
  placementSettings: PlacementSettings[];
  offers: Offer[];
  isOpen?: boolean;
}

export interface CampaignOptions {
  automaticallyCheckOptIn: boolean;
  emailCaptureOnAddToOrder: boolean;
  emailCaptureOnOffers: boolean;
  saveOfferOptions: {
    allowEmail: boolean;
    allowSavingOffers: boolean;
    allowSms: boolean;
  };
  sendOneEmailPerOffer: boolean;
  showAddToOrder: boolean;
  storeEmailForFuture: boolean;
  useEmailFromDataLayer: boolean;
}

export interface LayoutSettings {
  mobile: LayoutDeviceSettings;
  desktop: LayoutDeviceSettings;
}

export interface ButtonShowMore {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  fontWeight: number;
  rounding: number;
  input: string;
}

export interface TemplateFilters {
  deviceType: LayoutDevices;
  imageSize: ImageSize;
  stage: PlacementStage;
  layoutType: LayoutType;
  offerCount?: string;
}

export interface Template extends TemplateFilters {
  isActive: boolean;
  name: string;
  identifier: string;
  imageURL: string;
}

export interface LayoutDeviceSettings {
  type?: LayoutClass;
  button: ButtonSettings;
  popup: PopupSettings;
  action: ActionSettings;
  inline: InlineSettings;
  template: Template;
  settings?: TemplateOptionSettings;
}

export interface FiltersSettings {
  filters: boolean;
  textColor: string;
  activeColor: string;
  borderUnderline: boolean;
  backgroundColor: string;
  backgroundActiveColor: string;
  borderColor: string;
  borderActiveColor: string;
  showMorePersonalOffers: string;
  showMoreTradeOffers: string;
  filterOffers: string;
  personalOffers: string;
  tradeOffers: string;
  allOffers: string;
}

export interface TemplateOptionSettings {
  location: LocationSettings;
  embeddedElement?: ElementSettings;
  mainLayout: MainLayoutSettings;
  dealLayout: DealLayoutSettings;
  showMore?: ButtonShowMore;
  filters?: FiltersSettings;
  otherSettings?: OtherSettingsInterface;
}

export interface MainLayoutSettings {
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  align: TextAlign;
  offersNumber: string;
  rowsNumber: string;
  startAsExpanded: boolean;
  paddingTopBottom: string;
  paddingLeftRight: string;
  highlightColor: string;
  showFeatured: boolean;
  headerText: string;
  headerFontSize: string;
  headerFontWeight: number;
  headerTextColor: string;
  subHeaderText: string;
  subHeaderFontSize: string;
  subHeaderFontWeight: number;
  subHeaderTextColor: string;
  countText: string;
  selectText: string;
  showQualifiedHeading: boolean;
  qualifiedHeadingText: string;
  fixedSizeWithColumns: boolean;
}

export interface DealLayoutSettings {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  fontSize: string;
  align: TextAlign;
  icons: TemplateIcons;
  buttonBackgroundColor: string;
  buttonBorderColor?: string;
  buttonTextColor: string;
  buttonFontSize: string;
  buttonFontWeight: number;
  buttonRounding: number;
  emailOpen: boolean;
  emailMeTheGift: string;
  emailSend: string;
  enterEmail: string;
  emailTextColor: string;
  emailIconColor: string;
  emailBorderColor?: string;
  emailRounding?: number;
  emailBackground?: string;
  emailFontSize?: string;
  emailFontWeight?: number;
  emailButtonBackgroundColor: string;
  emailButtonTextColor: string;
  emailButtonBorderColor?: string;
  emailButtonRounding: number;
  emailDropdownBackground?: string;
  showHeader?: string;
}

export interface OtherSettingsInterface {
  selectedButtonText: string;
  notSelectedButtonText: string;
  textColor: string;
  buttonFontWeight: number;
  showSelectAll: boolean;
  selectedText: string;
  showCounter: boolean;
  counterText: string;
  showCheckboxSelect: boolean;
}

export interface OfferCategory {
  category_id: string;
  name: string;
}

export interface CompanyCategory {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  currencySymbol: string;
  isoCode: string;
  name: string;
}

export interface Retailer {
  id: string;
  name: string;
  logoUrl: string;
}

export interface FrequncyCapping {
  isEnabled: boolean;
  frequency: number | null;
  reset: number | null;
}

export interface FrequncyCappingOffer {
  useFrom: UseFrom;
  frequency: number;
  reset: number;
}

export interface OfferRule {
  searchType: CONDITION_SEARCH_TYPE;
  operator: CONDITION_OPERATORS_AMOUNT | CONDITION_OPERATORS_TEXT;
  targetValue: string;
  location: CONDITION_SEARCH_LOCATION;
  locationValue: string;
}

export interface OfferRules {
  logicalOperator: string;
  rules: OfferRule[];
}

export interface OfferRelevance {
  showIfFalse: boolean;
  slot: string;
  rules: OfferRules[];
}

export interface OfferAppearance {
  frequencyCapping: FrequncyCappingOffer;
  relevance: OfferRelevance;
}

export enum VoucherType {
  SINGLE = "single",
  CUSTOM = "custom",
}

export enum MediaType {
  main = "main",
  email = "email",
  featured = "featured",
}

export interface ImageUpload {
  filename: string;
  folderPath: string;
  filepath: string;
}

export interface OfferFeatureMedia {
  featuredVideoURL: string;
  images: ImageUpload[];
  title: string;
  description: string;
}

export interface OfferResolutionMedia {
  type: string;
  size: string;
  images: ImageUpload[];
  title: string;
  description: string;
}

export interface Offer {
  isAdded?: boolean;
  status: string;
  displayStatus: string;
  type: string;
  title: string;
  description: string;
  longDescription: string;
  faqs: string;
  terms: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  destinationUrl: string;
  trackingUrl: string;
  offerCTAText: string;
  offerCpa: {
    display: string;
    value: number;
  };
  epc: number;
  voucher: {
    code: string;
    exclusive: boolean;
    voucherType: VoucherType;
  };
  exclusiveTo: {
    categories: CompanyCategory[];
    regions: Country[];
    retailers: Retailer[];
  };
  appearanceRules: OfferAppearance;
  categories: OfferCategory[];
  brandswopExclusive: boolean;
  isExternal: boolean;
  externalNetwork: {
    promotionId: number;
  };
  advertiser: {
    name: string;
    company_Id: string;
    external_aId: string;
    uniqueNetworkIdentifier: string;
  };
  slot: number;
  media: {
    featured: OfferFeatureMedia;
    mainImage: ImageUpload[];
    videoURL: string;
    resolution: OfferResolutionMedia[];
  };

  offerSettings: {
    recPlacement: string[];
    allowShare: boolean;
    allowStacked: boolean;
    redeemBy: RedeemBy;
    delaySetting: {
      delayType: DelayType;
      delayValue: string;
      emailTemplateId: string;
    };
    isB2C: boolean;
    bundleOptions: {
      isBundled: boolean;
      originOffer: {
        offerId: string;
        advertiser: string;
        imageURL: string;
        description: string;
        title: string;
        endDate: string;
      },
      destinationOffer: {
        offerId: string;
        advertiser: string;
        imageURL: string;
        description: string;
        title: string;
        endDate: string;
      },
    }
  };
  id: string;
  orderId: string;
  badge: {
    id: string;
    name: string;
    useBorder: boolean;
    backgroundColor: string;
    fontColor: string;
    isDefault: boolean;
  } | null;
}

export interface BundleOffer {
  id: string;
  bundleOfferId: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  faqs: string;
  terms: string;
  offerCTAText: string;
  trackingURL: string;
  originOfferId: string;
  destinationOfferId: string;
  userSession: string;
  campaignId: string;
  companyId: string;
  placementId: string;
  orderId: string;
}

export interface ButtonOptions {
  location: LocationPosition;
  text: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  borderRadius: number;
}

export enum CAMPAIGNSTEPS {
  details = "details",
  offers = "offers",
  layout = "layout",
  placement = "placement",
}

export interface PlacementSettings {
  id: string;
  page: string;
  isRedeemable: boolean;
  hasExitView: boolean;
  isVisible: boolean;
  displayOnly: boolean;
  promoMessage: string;
  layoutId: string;
  name: string;
  isEdit: boolean;
  templateSettings: LayoutSettings;
}

export interface GeneralOptions {
  location: LocationPosition;
  offers: string;
  align: TextAlign;
  headerTextColor: string;
  text: string;
  backgroundColor: string;
}

export interface ButtonSettings {
  location: ButtonLocationSettingsT;
  text: string;
  sizes: ButtonSizesSettings;
  shape: ButtonShapes;
  style: ButtonStyleSettingsT;
}

export interface PopupSettings {
  minimized: boolean;
  general: GeneralSettings;
  location: LocationSettings;
  header: TextSettings;
  text: TextSettings;
  image: ImageSettings;
  getButton: GetButtonSettings;
  imageRepresentation: ImageRepresentationSettings;
}

export interface ActionSettings {
  minimized: boolean;
  general: GeneralSettings;
  location: LocationSettings;
  behaviour: BehaviourSettings;
  header: TextSettings;
  text: TextSettings;
  image: ImageSettings;
  getButton: GetButtonSettings;
  imageRepresentation: ImageRepresentationSettings;
}

export interface InlineSettings {
  minimized: boolean;
  element: ElementSettings;
  general: GeneralSettings;
  behaviour: BehaviourSettings;
  header: TextSettings;
  text: TextSettings;
  image: ImageSettings;
  getButton: GetButtonSettings;
  imageRepresentation: ImageRepresentationSettings;
}

export interface ElementSettings {
  attribute: string;
  existingElement: boolean;
  elementType: "id" | "class";
  fullWidth: boolean;
  width: number;
  height: number;
  marginType: "%" | "px";
  margin: number;
  paddingTop: number;
  paddingBottom: number;
}

export interface GeneralSettings {
  backgroundColor: string;
  offers: string;
  align: TextAlign;
}

export interface TextSettings {
  textColor: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  textTransform: TextTransform;
}

export interface GetButtonSettings {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  rounding: number;
  borderColor?: string;
  textTransform?: TextTransform;
}

export interface BehaviourSettings {
  displayBy: "time" | "scroll";
  afterTime?: number;
}

export interface LocationSettings {
  location: LocationPosition;
  transition: number;
  x?: number;
  y?: number;
}

export interface ButtonLocationSettingsT {
  location: LocationPosition;
  x?: number;
  y?: number;
}

export interface ButtonSizesSettings {
  type?: "flex" | "fixed";
  w: number;
  h: number;
}

export interface ButtonStyleSettingsT {
  textColor: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  textTransform: TextTransform;
  backgroundColor: string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  circleSize?: number;
}

export interface ImageSettings {
  size: ImageSizes;
  rounding: number;
}

export interface AutoEmailStorage {
  offerLink: string;
  offerId: string;
  email: string;
}

export interface SelectedOfferStorage {
  id: string;
  link: string;
  active: boolean;
}

export interface ImageRepresentationSettings {
  position: ImageRepresentation;
}

export enum ImageSizes {
  small = "small",
  medium = "medium",
  large = "large",
}

export interface BoundingClient {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

export interface OffersIdSlots {
  id: string;
  slot: number;
}

export enum TextTransform {
  uppercase = "uppercase",
  capitalize = "capitalize",
}

export enum ButtonShapes {
  roundingAll = "roundingAll",
  roundingTop = "roundingTop",
  roundingBottom = "roundingBottom",
  square = "square",
  circle = "circle",
  squareImage = "squareImage",
  squareImageLock = "squareImageLock",
}

export enum LocationPosition {
  bottom = "bottom",
  left = "left",
  center = "center",
  right = "right",
  top = "top",
  topLeft = "topLeft",
  topRight = "topRight",
  bottomLeft = "bottomLeft",
  bottomRight = "bottomRight",
}

export enum TextAlign {
  start = "start",
  left = "left",
  right = "right",
  center = "center",
  justify = "justify",
}

export interface ApiResponse {
  result: any;
  status: boolean;
}

export interface ApiErrorMessages {
  errorCode: number;
  message: string;
}

export enum LayoutClass {
  button = "button",
  action = "action",
  inline = "inline",
  popup = "popup",
}

export enum SinglePanels {
  overview = "overview",
  autoEmail = "autoEmail",
  faqs = "faqs",
  terms = "terms",
  share = "share",
}

export enum BundlePanels {
  faqs = "faqs",
  terms = "terms",
}

export interface QueryCustomVoucher {
  offerId: string;
  campaignId: string;
}


export interface FiltersSettings {
  filters: boolean;
  textColor: string;
  activeColor: string;
  borderUnderline: boolean;
  backgroundColor: string;
  backgroundActiveColor: string;
  borderColor: string;
  borderActiveColor: string;
  showMorePersonalOffers: string;
  showMoreTradeOffers: string;
  personalOffers: string;
  filterOffers: string;
  tradeOffers: string;
  allOffers: string;
}

export interface TemplateOptionSettings {
  location: LocationSettings;
  mainLayout: MainLayoutSettings;
  dealLayout: DealLayoutSettings;
  delay: BehaviourSettings;
  showMore?: ButtonShowMore;
  embeddedElement?: ElementSettings;
  filters?: FiltersSettings;
  otherSettings?: OtherSettingsInterface;
}

export interface MainLayoutSettings {
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  align: TextAlign;
  offersNumber: string;
  rowsNumber: string;
  startAsExpanded: boolean;
  highlightColor: string;
  showFeatured: boolean;
  paddingTopBottom: string;
  paddingLeftRight: string;
  headerText: string;
  headerFontSize: string;
  headerFontWeight: number;
  headerTextColor: string;
  subHeaderText: string;
  subHeaderFontSize: string;
  subHeaderFontWeight: number;
  subHeaderTextColor: string;
  countText: string;
  selectText: string;
  marginType?: "%" | "px";
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  showQualifiedHeading?: boolean;
  qualifiedHeadingText?: string;
  fixedSizeWithColumns?: boolean;
}

export interface DealLayoutSettings {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  fontSize: string;
  align: TextAlign;
  icons: TemplateIcons;
  buttonBackgroundColor: string;
  buttonBorderColor?: string;
  buttonTextColor: string;
  buttonFontSize: string;
  buttonFontWeight: number;
  buttonRounding: number;
  emailOpen: boolean;
  emailMeTheGift: string;
  emailSend: string;
  enterEmail: string;
  emailTextColor: string;
  emailIconColor: string;
  emailBorderColor?: string;
  emailRounding?: number;
  emailBackground?: string;
  emailFontSize?: string;
  emailFontWeight?: number;
  emailButtonBackgroundColor: string;
  emailButtonTextColor: string;
  emailButtonBorderColor?: string;
  emailButtonRounding: number;
  emailDropdownBackground?: string;
  showHeader?: boolean;
}
export interface OtherSettingsInterface {
  selectedButtonText: string;
  notSelectedButtonText: string;
  textColor: string;
  buttonFontWeight: number;
  showSelectAll: boolean;
  selectedText: string;
  showCounter: boolean;
  counterText: string;
  showCheckboxSelect: boolean;
}

export interface OffersIdSlots {
  id: string;
  slot: number;
}