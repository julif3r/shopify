import {
  reactExtension,
  useApi,
  TextBlock,
  Link,
  Modal,
  View,
  BlockStack,
  Button,
  Image,
  Checkbox,
  Icon,
  InlineLayout,
  Heading,
  Pressable,
  Disclosure,
  Text,
  InlineStack,
  ListItem,
  List,
  TextField,
  Grid,
  useStorage,
  useExtensionApi,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useState } from "react";
import * as React from "react";
import {
  CampaignType,
  Offer,
  OffersIdSlots,
  PlacementStage,
  QueryPostOfferView,
  QuerySaveEmail,
  TemplateOptionSettings,
} from "./types/global.types";
import {
  getTrackingEvent,
  postOfferView,
  postTagEmailOffer,
} from "./services/offers/offers.service";
import { getSessionId } from "./utility/session";
import { Shop, Style } from "@shopify/ui-extensions/checkout";
import { DomHandler } from "domhandler";
import { Parser } from "htmlparser2";
import {
  getLabelFromKeySize,
  getLabelFromKeyButtonType,
  itemShopifyButtonTypeList,
  itemsShopifyColourList,
} from "./utility/templateOptions";
import {
  getLabelFromKeyColour,
  itemsShopifySizeList,
} from "./utility/templateOptions";
import { EMAIL_REGEX } from "./utility/regExp";
import { useAppBridge } from "@shopify/app-bridge-react";

import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";

export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

export function Extension() {
  const [openIds, setOpenIds] = useState<string[]>(["content"]);
  const { shop, sessionToken } = useApi();
  const shopify = useAppBridge();
  const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY, // API key from the Partner Dashboard
    host: new URLSearchParams(location.search).get("host"), // host from URL search parameter
  });

  const [campaign, setCampaign] = useState<CampaignType>();
  const [offers, setOffers] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pagination, setPagination] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [emailTerms, setEmailTerms] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [settings, setSettings] = useState<TemplateOptionSettings>();
  const [eventOfferIds, setEventOfferIds] = useState<string[]>([]);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const awaitToken = async () => {
      const token = await shopify.idToken();
      console.log(token);
    };

    awaitToken();

    // const getToken = async () => {
    //   const token = await getSessionToken(app);
    //   setToken(token);
    // };
    // getToken();
  }, [app]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const setDefaultOfferImpressionEvent = async (offers: OffersIdSlots[]) => {
    if (offers.length > 0 && eventOfferIds.length < campaign.offers.length) {
      const data: QueryPostOfferView = {
        offers,
        campaignId: campaign?.id,
        campaignName: campaign.name || "",
        companyId: campaign.company_Id,
        placementId: campaign?.placementSettings[0].id,
        placementName: campaign?.placementSettings[0].name,
        pageUrl: "",
        layoutId: campaign?.placementSettings[0].layoutId,
        templateId: "shopify-template",
        pltype: PlacementStage.post,
      };

      setEventOfferIds((prevState) => [
        ...prevState,
        ...offers.map((offer) => offer.id),
      ]);

      await postOfferView(data, token);
    }
  };

  const tagMap = {
    a: {
      component: Link,
      getProps: (attribs) => ({
        url: attribs.href,
        key: `link-${Math.random()}`,
      }),
    },
    strong: {
      component: Text,
      getProps: () => ({ fontWeight: "bold", key: `strong-${Math.random()}` }),
    },
    em: {
      component: Text,
      getProps: () => ({ fontStyle: "italic", key: `em-${Math.random()}` }),
    },
    b: {
      component: Text,
      getProps: () => ({ fontWeight: "bold", key: `b-${Math.random()}` }),
    },
    i: {
      component: Text,
      getProps: () => ({ fontStyle: "italic", key: `i-${Math.random()}` }),
    },
    p: {
      component: Text,
      getProps: () => ({ variant: "bodyMd", key: `p-${Math.random()}` }),
    },
    h1: {
      component: Heading,
      getProps: () => ({ level: "1", key: `h1-${Math.random()}` }),
    },
    h2: {
      component: Heading,
      getProps: () => ({ level: "2", key: `h2-${Math.random()}` }),
    },
    h3: {
      component: Heading,
      getProps: () => ({ level: "3", key: `h3-${Math.random()}` }),
    },
    ul: {
      component: List,
      getProps: () => ({ key: `ul-${Math.random()}` }),
    },
    li: {
      component: ListItem,
      getProps: () => ({ key: `li-${Math.random()}` }),
    },
    br: {
      component: Text,
      getProps: () => ({ children: "\n", key: `br-${Math.random()}` }),
    },
  };

  function htmlToShopifyComponents(html) {
    const handler = new DomHandler();
    const parser = new Parser(handler);
    parser.write(html);
    parser.end();

    const dom = handler.dom;

    function processNode(node) {
      if (node.type === "text") {
        return node.data.trim() ? node.data : null;
      } else if (node.type === "tag") {
        const mapping = tagMap[node.name];
        if (!mapping) {
          return processChildren(node.children);
        }
        const { component: Component, getProps = () => ({}) } = mapping;
        const props = getProps(node.attribs);
        const children = processChildren(node.children);
        return React.createElement(Component, props, ...children);
      }
      return null;
    }

    function processChildren(children) {
      if (!children) return [];
      return children.map(processNode).filter((child) => child != null);
    }

    const result = processChildren(dom);
    return result.length === 1
      ? result[0]
      : React.createElement(React.Fragment, {}, ...result);
  }

  async function fetchCampaigns(params: Shop) {
    var queryParams = {
      pageParams: {
        page: `https://${params.myshopifyDomain}/checkouts/`,
        ruleFilters: [],
        accessParam: "",
      },
      contactDetails: [],
      selectedOffers: [],
      companyToken: params.id.match(/\d+/g).join(""),
    };
    const res = await fetch(
      `${process.env.SHOPIFY_APP_TAGAPI_URL}/tag/campaigns`,
      {
        method: "POST",
        body: JSON.stringify(queryParams),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
          usersessionid: getSessionId(),
        },
      },
    );
    const response = await res.json();

    if (response.result && !response.result.length) {
      setCampaign(response.result);
      setOffers(response.result.offers);
      setTotalPages(Math.ceil(response.result?.offers?.length / 3));
      setPagination(1);
      setSettings(
        response.result.placementSettings[0].templateSettings.desktop.settings,
      );
    }
  }

  useEffect(() => {
    if (token) {
      fetchCampaigns(shop);
    }
  }, [shop, token]);

  useEffect(() => {
    setDefaultOfferImpressionEvent(
      offers.slice((pagination - 1) * 3, pagination * 3),
    );
  }, [pagination]);

  useEffect(() => {
    if (campaign) {
      getTrackingEvent(
        {
          event: "ontemplateseen",
          retailerId: campaign?.company_Id,
          campaignId: campaign?.id,
          placementId: campaign?.placementSettings[0].id,
          placementName: campaign?.placementSettings[0].name,
          pltid: campaign?.placementSettings[0].layoutId,
          tid: "shopify-template",
          pltype: PlacementStage.post,
        },
        token,
      );
      getTrackingEvent(
        {
          event: "ontemplateopen",
          retailerId: campaign?.company_Id,
          campaignId: campaign?.id,
          placementId: campaign?.placementSettings[0].id,
          placementName: campaign?.placementSettings[0].name,
          pltid: campaign?.placementSettings[0].layoutId,
          tid: "shopify-template",
          pltype: PlacementStage.post,
        },
        token,
      );
    }
  }, [campaign]);

  const submitEmail = async (offer: Offer) => {
    if (email && EMAIL_REGEX.test(email)) {
      const emailParams: QuerySaveEmail = {
        offerid: offer.id,
        email: email,
        offerLink: offer.trackingUrl,
        companyId: campaign?.company_Id,
        layoutId: campaign?.placementSettings[0].layoutId,
        campaignId: campaign?.id,
        templateId: "shopify-template",
        placementId: campaign?.placementSettings[0].id,
        slot: offer.slot,
        orderId: offer.orderId,
        pltype: campaign?.placementSettings[0].displayOnly
          ? PlacementStage.pre
          : PlacementStage.post,
      };

      const response = await postTagEmailOffer(emailParams, token);

      if (response.status) {
        setEmailSent(true);
      }

      getTrackingEvent(
        {
          event: "onsendemailclick",
          retailerId: campaign?.company_Id,
          campaignId: campaign?.id,
          offerId: offer.id,
          placementId: campaign?.placementSettings[0].id,
          placementName: campaign?.placementSettings[0].name,
          pltid: campaign?.placementSettings[0].layoutId,
          tid: "shopify-template",
          slot: offer.slot,
          pltype: campaign?.placementSettings[0].displayOnly
            ? PlacementStage.pre
            : PlacementStage.post,
        },
        token,
      );
    }
  };

  const onCloseEmailModal = () => {
    setEmailSent(false);
  };

  const handleInfoClick = (offer: Offer) => {
    getTrackingEvent(
      {
        event: "onreadmoreclick",
        offerId: offer.id,
        retailerId: campaign?.company_Id,
        campaignId: campaign?.id,
        placementId: campaign?.placementSettings[0].id,
        placementName: campaign?.placementSettings[0].name,
        pltid: campaign?.placementSettings[0].layoutId,
        tid: "shopify-template",
        slot: offer.slot,
        pltype: PlacementStage.post,
      },
      token,
    );
  };

  const handleInfoClose = async (offer: Offer) => {
    await getTrackingEvent(
      {
        event: "onreadmoreclose",
        offerId: offer.id,
        retailerId: campaign?.company_Id,
        campaignId: campaign?.id,
        placementId: campaign?.placementSettings[0].id,
        placementName: campaign?.placementSettings[0].name,
        pltype: campaign?.placementSettings[0].displayOnly
          ? PlacementStage.pre
          : PlacementStage.post,
        tid: "shopify-template",
        slot: offer.slot,
        pltid: campaign?.placementSettings[0].layoutId,
      },
      token,
    );
  };

  return (
    <>
      {campaign && (
        <>
          <Heading level={1}>
            <TextBlock
              size={getLabelFromKeySize(
                settings?.mainLayout.headerFontSize,
                itemsShopifySizeList,
              )}
              appearance={getLabelFromKeyColour(
                settings?.mainLayout.headerTextColor,
                itemsShopifyColourList,
              )}
            >
              {settings?.mainLayout.headerText}
            </TextBlock>
          </Heading>
          <BlockStack>
            <TextBlock
              appearance={getLabelFromKeyColour(
                settings?.mainLayout.subHeaderTextColor,
                itemsShopifyColourList,
              )}
              size={getLabelFromKeySize(
                settings?.mainLayout.subHeaderFontSize,
                itemsShopifySizeList,
              )}
            >
              {settings?.mainLayout.subHeaderText}
            </TextBlock>
            {offers?.map((offer, index) => (
              <React.Fragment key={offer.id}>
                {(pagination - 1) * 3 <= index && index < pagination * 3 && (
                  <View border="base" padding="base" key={offer.id}>
                    <InlineLayout columns={[120, "fill", 24]}>
                      <View
                        border="none"
                        padding={["none", "base", "none", "none"]}
                      >
                        <Image source={offer.imageUrl} fit="cover" />
                      </View>

                      <View
                        border="none"
                        padding="none"
                        blockAlignment="center"
                      >
                        <BlockStack>
                          <View
                            border="none"
                            padding="none"
                            inlineAlignment="start"
                          >
                            <Heading level={3}>
                              <TextBlock size="medium" appearance="info">
                                {offer.title}
                              </TextBlock>
                            </Heading>
                            <TextBlock size="small" appearance="info">
                              {offer.description}
                            </TextBlock>
                          </View>

                          <View border="none" padding="none">
                            <Button
                              to={offer.trackingUrl}
                              target="_blank"
                              appearance={getLabelFromKeyButtonType(
                                settings?.dealLayout.buttonBackgroundColor,
                                itemShopifyButtonTypeList,
                              )}
                            >
                              <TextBlock
                                appearance={getLabelFromKeyColour(
                                  settings?.dealLayout.buttonTextColor,
                                  itemsShopifyColourList,
                                )}
                              >
                                {offer.offerCTAText}
                              </TextBlock>
                            </Button>
                          </View>
                        </BlockStack>
                      </View>

                      <View
                        border="none"
                        padding={["none", "none", "base", "none"]}
                      >
                        <BlockStack>
                          <Pressable
                            onPress={() => handleInfoClick(offer)}
                            overlay={
                              <Modal
                                size="max"
                                title=""
                                onClose={() => handleInfoClose(offer)}
                              >
                                <View border="none" padding="base">
                                  {/* <InlineLayout columns={[400, "fill"]}> */}
                                  <Grid
                                    columns={Style.default("fill").when(
                                      { viewportInlineSize: { min: "small" } },
                                      [400, "fill"],
                                    )}
                                  >
                                    <View
                                      border="none"
                                      padding={["base", "none", "none", "none"]}
                                    >
                                      <BlockStack>
                                        <View border="none" padding="none">
                                          <Image
                                            source={offer.imageUrl}
                                            cornerRadius="base"
                                            aspectRatio={1}
                                            fit="contain"
                                          />
                                        </View>
                                        <View
                                          border="none"
                                          padding={[
                                            "none",
                                            "none",
                                            "extraLoose",
                                            "none",
                                          ]}
                                          inlineAlignment="center"
                                        >
                                          <Button
                                            to={offer.trackingUrl}
                                            target="_blank"
                                            appearance={getLabelFromKeyButtonType(
                                              settings?.dealLayout
                                                .buttonBackgroundColor,
                                              itemShopifyButtonTypeList,
                                            )}
                                          >
                                            {offer.offerCTAText}
                                          </Button>
                                        </View>
                                      </BlockStack>
                                    </View>

                                    <View border="none" padding="base">
                                      <View
                                        border="none"
                                        borderRadius="none"
                                        padding={[
                                          "none",
                                          "none",
                                          "base",
                                          "none",
                                        ]}
                                      >
                                        <Heading level={1}>
                                          {offer.title}
                                        </Heading>
                                      </View>
                                      <Disclosure defaultOpen={openIds}>
                                        <BlockStack>
                                          <View
                                            border="base"
                                            borderRadius="base"
                                            padding={[
                                              "base",
                                              "base",
                                              "base",
                                              "base",
                                            ]}
                                          >
                                            <BlockStack>
                                              <Pressable
                                                toggles="content"
                                                padding={[
                                                  "none",
                                                  "none",
                                                  "none",
                                                  "none",
                                                ]}
                                                onPress={() =>
                                                  setOpenIds(
                                                    openIds.includes("content")
                                                      ? openIds.filter(
                                                          (id) =>
                                                            id !== "content",
                                                        )
                                                      : ["content"],
                                                  )
                                                }
                                              >
                                                <InlineLayout
                                                  accessibilityRole="header"
                                                  columns={["fill", 30]}
                                                >
                                                  <Heading level={3}>
                                                    Content
                                                  </Heading>
                                                  <Icon
                                                    source={
                                                      openIds.includes(
                                                        "content",
                                                      )
                                                        ? "chevronUp"
                                                        : "chevronDown"
                                                    }
                                                    size="large"
                                                  />
                                                </InlineLayout>
                                              </Pressable>
                                              <View
                                                id="content"
                                                border="none"
                                                padding="none"
                                              >
                                                <TextBlock>
                                                  {htmlToShopifyComponents(
                                                    offer.longDescription,
                                                  )}
                                                </TextBlock>
                                              </View>
                                            </BlockStack>
                                          </View>

                                          {offer.faqs && (
                                            <View
                                              border="base"
                                              borderRadius="base"
                                              padding={[
                                                "base",
                                                "base",
                                                "base",
                                                "base",
                                              ]}
                                            >
                                              <BlockStack>
                                                <Pressable
                                                  toggles="faqs"
                                                  padding="none"
                                                  onPress={() =>
                                                    setOpenIds(
                                                      openIds.includes("faqs")
                                                        ? openIds.filter(
                                                            (id) =>
                                                              id !== "faqs",
                                                          )
                                                        : ["faqs"],
                                                    )
                                                  }
                                                >
                                                  <InlineLayout
                                                    columns={["fill", 30]}
                                                    padding={[
                                                      "none",
                                                      "none",
                                                      "none",
                                                      "none",
                                                    ]}
                                                  >
                                                    <Heading level={3}>
                                                      FAQs
                                                    </Heading>
                                                    <Icon
                                                      source={
                                                        openIds.includes("faqs")
                                                          ? "chevronUp"
                                                          : "chevronDown"
                                                      }
                                                      size="large"
                                                    />
                                                  </InlineLayout>
                                                </Pressable>
                                                <View
                                                  id="faqs"
                                                  border="none"
                                                  padding="none"
                                                >
                                                  <TextBlock>
                                                    {htmlToShopifyComponents(
                                                      offer.faqs,
                                                    )}
                                                  </TextBlock>
                                                </View>
                                              </BlockStack>
                                            </View>
                                          )}

                                          {offer.terms && (
                                            <View
                                              border="base"
                                              borderRadius="base"
                                              padding={[
                                                "base",
                                                "base",
                                                "base",
                                                "base",
                                              ]}
                                            >
                                              <BlockStack>
                                                <Pressable
                                                  toggles="terms"
                                                  padding="none"
                                                  onPress={() =>
                                                    setOpenIds(
                                                      openIds.includes("terms")
                                                        ? openIds.filter(
                                                            (id) =>
                                                              id !== "terms",
                                                          )
                                                        : ["terms"],
                                                    )
                                                  }
                                                >
                                                  <InlineLayout
                                                    columns={["fill", 30]}
                                                    padding={[
                                                      "none",
                                                      "none",
                                                      "none",
                                                      "none",
                                                    ]}
                                                  >
                                                    <Heading level={3}>
                                                      Terms
                                                    </Heading>
                                                    <Icon
                                                      source={
                                                        openIds.includes(
                                                          "terms",
                                                        )
                                                          ? "chevronUp"
                                                          : "chevronDown"
                                                      }
                                                      size="large"
                                                    />
                                                  </InlineLayout>
                                                </Pressable>
                                                <View
                                                  id="terms"
                                                  border="none"
                                                  padding="none"
                                                >
                                                  <TextBlock>
                                                    {htmlToShopifyComponents(
                                                      offer.terms,
                                                    )}
                                                  </TextBlock>
                                                </View>
                                              </BlockStack>
                                            </View>
                                          )}
                                        </BlockStack>
                                      </Disclosure>
                                    </View>
                                  </Grid>
                                  {/* </InlineLayout> */}
                                </View>
                              </Modal>
                            }
                          >
                            <Icon
                              source="info"
                              size="large"
                              appearance="info"
                            />
                          </Pressable>

                          <Pressable
                            overlay={
                              <Modal
                                size="max"
                                title=""
                                onClose={onCloseEmailModal}
                              >
                                <View border="none" padding="base">
                                  <Grid
                                    columns={Style.default("fill").when(
                                      { viewportInlineSize: { min: "small" } },
                                      [400, "fill"],
                                    )}
                                  >
                                    <View
                                      border="none"
                                      padding={["base", "none", "none", "none"]}
                                    >
                                      <BlockStack>
                                        <View border="none" padding="none">
                                          <Image
                                            source={offer.imageUrl}
                                            cornerRadius="base"
                                            aspectRatio={1}
                                            fit="contain"
                                          />
                                        </View>
                                        <View
                                          border="none"
                                          padding="none"
                                          inlineAlignment="center"
                                        >
                                          {/* <Button>{offer.offerCTAText}</Button> */}
                                        </View>
                                      </BlockStack>
                                    </View>

                                    <View border="none" padding="base">
                                      <View
                                        border="none"
                                        borderRadius="none"
                                        padding={[
                                          "none",
                                          "none",
                                          "base",
                                          "none",
                                        ]}
                                      >
                                        <Heading level={1}>
                                          {offer.title}
                                        </Heading>
                                      </View>
                                      <View
                                        border="base"
                                        borderRadius="base"
                                        padding={[
                                          "loose",
                                          "base",
                                          "loose",
                                          "base",
                                        ]}
                                      >
                                        <Heading level={2}>
                                          Email me the gift
                                        </Heading>
                                        <View
                                          border="none"
                                          padding={[
                                            "loose",
                                            "none",
                                            "loose",
                                            "none",
                                          ]}
                                        >
                                          <TextField
                                            label="Email"
                                            type="email"
                                            icon={{
                                              source: "email",
                                              position: "end",
                                            }}
                                            onChange={handleEmailChange}
                                            error={
                                              email
                                                ? !EMAIL_REGEX.test(email)
                                                  ? "Invalid email address"
                                                  : undefined
                                                : undefined
                                            }
                                            value={email}
                                          />
                                        </View>

                                        <View
                                          border="none"
                                          padding={[
                                            "base",
                                            "none",
                                            "base",
                                            "none",
                                          ]}
                                        >
                                          <TextBlock>
                                            Your data will be processed
                                            according to BrandSwap's{" "}
                                            <Link
                                              to="https://www.brandswap.com/privacy"
                                              external
                                            >
                                              privacy policy
                                            </Link>
                                          </TextBlock>
                                        </View>

                                        <Checkbox
                                          id="checkbox"
                                          name="checkbox"
                                          checked={emailTerms}
                                          onChange={() =>
                                            setEmailTerms(!emailTerms)
                                          }
                                        >
                                          I agree to share my email address with
                                          BrandSwap to receive details about
                                          this offer
                                        </Checkbox>

                                        <View
                                          border="none"
                                          padding="base"
                                          inlineAlignment="center"
                                        >
                                          <Button
                                            appearance={getLabelFromKeyButtonType(
                                              settings?.dealLayout
                                                .buttonBackgroundColor,
                                              itemShopifyButtonTypeList,
                                            )}
                                            accessibilityRole="submit"
                                            onPress={() => submitEmail(offer)}
                                            disabled={!emailTerms || !email}
                                          >
                                            <InlineLayout
                                              border="none"
                                              padding={["none", "base"]}
                                              inlineAlignment="center"
                                              blockAlignment="center"
                                            >
                                              Send{" "}
                                              {emailSent && (
                                                <Icon
                                                  source="success"
                                                  appearance="monochrome"
                                                />
                                              )}
                                            </InlineLayout>
                                          </Button>
                                        </View>
                                      </View>
                                    </View>
                                  </Grid>
                                </View>
                              </Modal>
                            }
                          >
                            <Icon
                              source="email"
                              size="large"
                              appearance="info"
                            />
                          </Pressable>
                        </BlockStack>
                      </View>
                    </InlineLayout>
                  </View>
                )}
              </React.Fragment>
            ))}

            <InlineStack inlineAlignment="center">
              <Button
                appearance={getLabelFromKeyButtonType(
                  settings?.dealLayout.buttonBackgroundColor,
                  itemShopifyButtonTypeList,
                )}
                kind="secondary"
                disabled={pagination === 1}
                onPress={() => setPagination(pagination - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page: number) => {
                  return (
                    <Button
                      appearance={getLabelFromKeyButtonType(
                        settings?.dealLayout.buttonBackgroundColor,
                        itemShopifyButtonTypeList,
                      )}
                      key={page}
                      kind={page === pagination ? "primary" : "secondary"}
                      onPress={() => setPagination(page)}
                    >
                      <TextBlock
                        appearance={getLabelFromKeyColour(
                          settings?.dealLayout.buttonTextColor,
                          itemsShopifyColourList,
                        )}
                      >
                        {page}
                      </TextBlock>
                    </Button>
                  );
                },
              )}
              <Button
                appearance={getLabelFromKeyButtonType(
                  settings?.dealLayout.buttonBackgroundColor,
                  itemShopifyButtonTypeList,
                )}
                kind="secondary"
                disabled={pagination === totalPages}
                onPress={() => setPagination(pagination + 1)}
              >
                Next
              </Button>
            </InlineStack>
          </BlockStack>
        </>
      )}
    </>
    // <BlockStack border={"dotted"} padding={"tight"}>
    //   <Text>{campaign?.name}</Text>
    //   <Banner title="BrandSwap thank you page extension">
    //     {translate("welcome", {
    //       target: <Text emphasis="italic">BrandSwap checkout extension</Text>,
    //     })}
    //   </Banner>
    // </BlockStack>
  );
}
