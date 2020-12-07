/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { BlogData } from "./data.server/blog";
import { CommunityData } from "./data.server/community";
import { DocsData, DocsTemplate } from "./data.server/docs";
import { PluginInfo } from "./components/community-menu/community-menu";
import { HeadingData, PageNavigation, TableOfContents } from "@stencil/ssg";
export namespace Components {
    interface AnchorLink {
        "to": string;
    }
    interface AppMenuToggle {
        "icon": string;
    }
    interface AvcCodeType {
        "typeId": string;
    }
    interface BlogPage {
        "data": BlogData[];
    }
    interface BlogPost {
        "data": BlogData;
    }
    interface CapacitorEnterprise {
    }
    interface CapacitorHubspotForm {
        "ajax": boolean;
        "formId"?: string;
        "goToWebinarKey"?: string;
        "portalId": string;
    }
    interface CapacitorSite {
    }
    interface CapacitorSiteFooter {
    }
    interface CodeSnippet {
        "code": string;
        "language": string;
    }
    interface CodeTabs {
        "data": {
    tabs: string[];
    languages: string[];
    code: string[];
  };
    }
    interface CommunityComponent {
        "data": CommunityData;
    }
    interface CommunityMenu {
        "activePath": string;
        "plugins": PluginInfo[];
        "template": DocsTemplate;
        "toggleOverlayMenu": () => Promise<void>;
    }
    interface CommunityPage {
        "data": any;
    }
    interface ContributorList {
        "contributors": string[];
        "repoFileUrl": string;
    }
    interface CordovaPage {
    }
    interface DocSnippet {
    }
    interface DocsComponent {
        "data": DocsData;
    }
    interface DocsMenu {
        "activePath": string;
        "template": DocsTemplate;
        "toc": TableOfContents;
        "toggleOverlayMenu": () => Promise<void>;
    }
    interface DocsSearch {
        "placeholder": string;
    }
    interface InPageNavigation {
        "editUrl": string;
        "headings": HeadingData[];
    }
    interface LandingPage {
        "data": any;
    }
    interface LowerContentNav {
        "navigation": PageNavigation;
    }
    interface MetaTags {
        "authorTwitter": string;
        "description": string;
        "image": string;
        "ogType": string;
        "pageTitle": string;
    }
    interface MoreButton {
        "icon": string;
    }
    interface NewsletterSignup {
    }
    interface PluginPlatforms {
        "platforms": string;
    }
    interface PreFooter {
    }
    interface SiteHeader {
        "includeBurger": boolean;
        "includeLogo": boolean;
        "template": DocsTemplate;
    }
    interface SolutionPage {
        "solutionId": string;
    }
    interface VersionSelect {
    }
}
declare global {
    interface HTMLAnchorLinkElement extends Components.AnchorLink, HTMLStencilElement {
    }
    var HTMLAnchorLinkElement: {
        prototype: HTMLAnchorLinkElement;
        new (): HTMLAnchorLinkElement;
    };
    interface HTMLAppMenuToggleElement extends Components.AppMenuToggle, HTMLStencilElement {
    }
    var HTMLAppMenuToggleElement: {
        prototype: HTMLAppMenuToggleElement;
        new (): HTMLAppMenuToggleElement;
    };
    interface HTMLAvcCodeTypeElement extends Components.AvcCodeType, HTMLStencilElement {
    }
    var HTMLAvcCodeTypeElement: {
        prototype: HTMLAvcCodeTypeElement;
        new (): HTMLAvcCodeTypeElement;
    };
    interface HTMLBlogPageElement extends Components.BlogPage, HTMLStencilElement {
    }
    var HTMLBlogPageElement: {
        prototype: HTMLBlogPageElement;
        new (): HTMLBlogPageElement;
    };
    interface HTMLBlogPostElement extends Components.BlogPost, HTMLStencilElement {
    }
    var HTMLBlogPostElement: {
        prototype: HTMLBlogPostElement;
        new (): HTMLBlogPostElement;
    };
    interface HTMLCapacitorEnterpriseElement extends Components.CapacitorEnterprise, HTMLStencilElement {
    }
    var HTMLCapacitorEnterpriseElement: {
        prototype: HTMLCapacitorEnterpriseElement;
        new (): HTMLCapacitorEnterpriseElement;
    };
    interface HTMLCapacitorHubspotFormElement extends Components.CapacitorHubspotForm, HTMLStencilElement {
    }
    var HTMLCapacitorHubspotFormElement: {
        prototype: HTMLCapacitorHubspotFormElement;
        new (): HTMLCapacitorHubspotFormElement;
    };
    interface HTMLCapacitorSiteElement extends Components.CapacitorSite, HTMLStencilElement {
    }
    var HTMLCapacitorSiteElement: {
        prototype: HTMLCapacitorSiteElement;
        new (): HTMLCapacitorSiteElement;
    };
    interface HTMLCapacitorSiteFooterElement extends Components.CapacitorSiteFooter, HTMLStencilElement {
    }
    var HTMLCapacitorSiteFooterElement: {
        prototype: HTMLCapacitorSiteFooterElement;
        new (): HTMLCapacitorSiteFooterElement;
    };
    interface HTMLCodeSnippetElement extends Components.CodeSnippet, HTMLStencilElement {
    }
    var HTMLCodeSnippetElement: {
        prototype: HTMLCodeSnippetElement;
        new (): HTMLCodeSnippetElement;
    };
    interface HTMLCodeTabsElement extends Components.CodeTabs, HTMLStencilElement {
    }
    var HTMLCodeTabsElement: {
        prototype: HTMLCodeTabsElement;
        new (): HTMLCodeTabsElement;
    };
    interface HTMLCommunityComponentElement extends Components.CommunityComponent, HTMLStencilElement {
    }
    var HTMLCommunityComponentElement: {
        prototype: HTMLCommunityComponentElement;
        new (): HTMLCommunityComponentElement;
    };
    interface HTMLCommunityMenuElement extends Components.CommunityMenu, HTMLStencilElement {
    }
    var HTMLCommunityMenuElement: {
        prototype: HTMLCommunityMenuElement;
        new (): HTMLCommunityMenuElement;
    };
    interface HTMLCommunityPageElement extends Components.CommunityPage, HTMLStencilElement {
    }
    var HTMLCommunityPageElement: {
        prototype: HTMLCommunityPageElement;
        new (): HTMLCommunityPageElement;
    };
    interface HTMLContributorListElement extends Components.ContributorList, HTMLStencilElement {
    }
    var HTMLContributorListElement: {
        prototype: HTMLContributorListElement;
        new (): HTMLContributorListElement;
    };
    interface HTMLCordovaPageElement extends Components.CordovaPage, HTMLStencilElement {
    }
    var HTMLCordovaPageElement: {
        prototype: HTMLCordovaPageElement;
        new (): HTMLCordovaPageElement;
    };
    interface HTMLDocSnippetElement extends Components.DocSnippet, HTMLStencilElement {
    }
    var HTMLDocSnippetElement: {
        prototype: HTMLDocSnippetElement;
        new (): HTMLDocSnippetElement;
    };
    interface HTMLDocsComponentElement extends Components.DocsComponent, HTMLStencilElement {
    }
    var HTMLDocsComponentElement: {
        prototype: HTMLDocsComponentElement;
        new (): HTMLDocsComponentElement;
    };
    interface HTMLDocsMenuElement extends Components.DocsMenu, HTMLStencilElement {
    }
    var HTMLDocsMenuElement: {
        prototype: HTMLDocsMenuElement;
        new (): HTMLDocsMenuElement;
    };
    interface HTMLDocsSearchElement extends Components.DocsSearch, HTMLStencilElement {
    }
    var HTMLDocsSearchElement: {
        prototype: HTMLDocsSearchElement;
        new (): HTMLDocsSearchElement;
    };
    interface HTMLInPageNavigationElement extends Components.InPageNavigation, HTMLStencilElement {
    }
    var HTMLInPageNavigationElement: {
        prototype: HTMLInPageNavigationElement;
        new (): HTMLInPageNavigationElement;
    };
    interface HTMLLandingPageElement extends Components.LandingPage, HTMLStencilElement {
    }
    var HTMLLandingPageElement: {
        prototype: HTMLLandingPageElement;
        new (): HTMLLandingPageElement;
    };
    interface HTMLLowerContentNavElement extends Components.LowerContentNav, HTMLStencilElement {
    }
    var HTMLLowerContentNavElement: {
        prototype: HTMLLowerContentNavElement;
        new (): HTMLLowerContentNavElement;
    };
    interface HTMLMetaTagsElement extends Components.MetaTags, HTMLStencilElement {
    }
    var HTMLMetaTagsElement: {
        prototype: HTMLMetaTagsElement;
        new (): HTMLMetaTagsElement;
    };
    interface HTMLMoreButtonElement extends Components.MoreButton, HTMLStencilElement {
    }
    var HTMLMoreButtonElement: {
        prototype: HTMLMoreButtonElement;
        new (): HTMLMoreButtonElement;
    };
    interface HTMLNewsletterSignupElement extends Components.NewsletterSignup, HTMLStencilElement {
    }
    var HTMLNewsletterSignupElement: {
        prototype: HTMLNewsletterSignupElement;
        new (): HTMLNewsletterSignupElement;
    };
    interface HTMLPluginPlatformsElement extends Components.PluginPlatforms, HTMLStencilElement {
    }
    var HTMLPluginPlatformsElement: {
        prototype: HTMLPluginPlatformsElement;
        new (): HTMLPluginPlatformsElement;
    };
    interface HTMLPreFooterElement extends Components.PreFooter, HTMLStencilElement {
    }
    var HTMLPreFooterElement: {
        prototype: HTMLPreFooterElement;
        new (): HTMLPreFooterElement;
    };
    interface HTMLSiteHeaderElement extends Components.SiteHeader, HTMLStencilElement {
    }
    var HTMLSiteHeaderElement: {
        prototype: HTMLSiteHeaderElement;
        new (): HTMLSiteHeaderElement;
    };
    interface HTMLSolutionPageElement extends Components.SolutionPage, HTMLStencilElement {
    }
    var HTMLSolutionPageElement: {
        prototype: HTMLSolutionPageElement;
        new (): HTMLSolutionPageElement;
    };
    interface HTMLVersionSelectElement extends Components.VersionSelect, HTMLStencilElement {
    }
    var HTMLVersionSelectElement: {
        prototype: HTMLVersionSelectElement;
        new (): HTMLVersionSelectElement;
    };
    interface HTMLElementTagNameMap {
        "anchor-link": HTMLAnchorLinkElement;
        "app-menu-toggle": HTMLAppMenuToggleElement;
        "avc-code-type": HTMLAvcCodeTypeElement;
        "blog-page": HTMLBlogPageElement;
        "blog-post": HTMLBlogPostElement;
        "capacitor-enterprise": HTMLCapacitorEnterpriseElement;
        "capacitor-hubspot-form": HTMLCapacitorHubspotFormElement;
        "capacitor-site": HTMLCapacitorSiteElement;
        "capacitor-site-footer": HTMLCapacitorSiteFooterElement;
        "code-snippet": HTMLCodeSnippetElement;
        "code-tabs": HTMLCodeTabsElement;
        "community-component": HTMLCommunityComponentElement;
        "community-menu": HTMLCommunityMenuElement;
        "community-page": HTMLCommunityPageElement;
        "contributor-list": HTMLContributorListElement;
        "cordova-page": HTMLCordovaPageElement;
        "doc-snippet": HTMLDocSnippetElement;
        "docs-component": HTMLDocsComponentElement;
        "docs-menu": HTMLDocsMenuElement;
        "docs-search": HTMLDocsSearchElement;
        "in-page-navigation": HTMLInPageNavigationElement;
        "landing-page": HTMLLandingPageElement;
        "lower-content-nav": HTMLLowerContentNavElement;
        "meta-tags": HTMLMetaTagsElement;
        "more-button": HTMLMoreButtonElement;
        "newsletter-signup": HTMLNewsletterSignupElement;
        "plugin-platforms": HTMLPluginPlatformsElement;
        "pre-footer": HTMLPreFooterElement;
        "site-header": HTMLSiteHeaderElement;
        "solution-page": HTMLSolutionPageElement;
        "version-select": HTMLVersionSelectElement;
    }
}
declare namespace LocalJSX {
    interface AnchorLink {
        "to"?: string;
    }
    interface AppMenuToggle {
        "icon"?: string;
        "onMenuToggleClick"?: (event: CustomEvent<any>) => void;
    }
    interface AvcCodeType {
        "typeId"?: string;
    }
    interface BlogPage {
        "data"?: BlogData[];
    }
    interface BlogPost {
        "data"?: BlogData;
    }
    interface CapacitorEnterprise {
    }
    interface CapacitorHubspotForm {
        "ajax"?: boolean;
        "formId"?: string;
        "goToWebinarKey"?: string;
        "onFormSubmitted"?: (event: CustomEvent<any>) => void;
        "portalId"?: string;
    }
    interface CapacitorSite {
    }
    interface CapacitorSiteFooter {
    }
    interface CodeSnippet {
        "code": string;
        "language"?: string;
    }
    interface CodeTabs {
        "data"?: {
    tabs: string[];
    languages: string[];
    code: string[];
  };
    }
    interface CommunityComponent {
        "data"?: CommunityData;
    }
    interface CommunityMenu {
        "activePath"?: string;
        "onMenuToggled"?: (event: CustomEvent<any>) => void;
        "plugins"?: PluginInfo[];
        "template"?: DocsTemplate;
    }
    interface CommunityPage {
        "data"?: any;
    }
    interface ContributorList {
        "contributors"?: string[];
        "repoFileUrl"?: string;
    }
    interface CordovaPage {
    }
    interface DocSnippet {
    }
    interface DocsComponent {
        "data"?: DocsData;
    }
    interface DocsMenu {
        "activePath"?: string;
        "onMenuToggled"?: (event: CustomEvent<any>) => void;
        "template"?: DocsTemplate;
        "toc"?: TableOfContents;
    }
    interface DocsSearch {
        "placeholder"?: string;
    }
    interface InPageNavigation {
        "editUrl"?: string;
        "headings"?: HeadingData[];
    }
    interface LandingPage {
        "data"?: any;
    }
    interface LowerContentNav {
        "navigation"?: PageNavigation;
    }
    interface MetaTags {
        "authorTwitter"?: string;
        "description"?: string;
        "image"?: string;
        "ogType"?: string;
        "pageTitle"?: string;
    }
    interface MoreButton {
        "icon"?: string;
    }
    interface NewsletterSignup {
    }
    interface PluginPlatforms {
        "platforms"?: string;
    }
    interface PreFooter {
    }
    interface SiteHeader {
        "includeBurger"?: boolean;
        "includeLogo"?: boolean;
        "template"?: DocsTemplate;
    }
    interface SolutionPage {
        "solutionId"?: string;
    }
    interface VersionSelect {
    }
    interface IntrinsicElements {
        "anchor-link": AnchorLink;
        "app-menu-toggle": AppMenuToggle;
        "avc-code-type": AvcCodeType;
        "blog-page": BlogPage;
        "blog-post": BlogPost;
        "capacitor-enterprise": CapacitorEnterprise;
        "capacitor-hubspot-form": CapacitorHubspotForm;
        "capacitor-site": CapacitorSite;
        "capacitor-site-footer": CapacitorSiteFooter;
        "code-snippet": CodeSnippet;
        "code-tabs": CodeTabs;
        "community-component": CommunityComponent;
        "community-menu": CommunityMenu;
        "community-page": CommunityPage;
        "contributor-list": ContributorList;
        "cordova-page": CordovaPage;
        "doc-snippet": DocSnippet;
        "docs-component": DocsComponent;
        "docs-menu": DocsMenu;
        "docs-search": DocsSearch;
        "in-page-navigation": InPageNavigation;
        "landing-page": LandingPage;
        "lower-content-nav": LowerContentNav;
        "meta-tags": MetaTags;
        "more-button": MoreButton;
        "newsletter-signup": NewsletterSignup;
        "plugin-platforms": PluginPlatforms;
        "pre-footer": PreFooter;
        "site-header": SiteHeader;
        "solution-page": SolutionPage;
        "version-select": VersionSelect;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "anchor-link": LocalJSX.AnchorLink & JSXBase.HTMLAttributes<HTMLAnchorLinkElement>;
            "app-menu-toggle": LocalJSX.AppMenuToggle & JSXBase.HTMLAttributes<HTMLAppMenuToggleElement>;
            "avc-code-type": LocalJSX.AvcCodeType & JSXBase.HTMLAttributes<HTMLAvcCodeTypeElement>;
            "blog-page": LocalJSX.BlogPage & JSXBase.HTMLAttributes<HTMLBlogPageElement>;
            "blog-post": LocalJSX.BlogPost & JSXBase.HTMLAttributes<HTMLBlogPostElement>;
            "capacitor-enterprise": LocalJSX.CapacitorEnterprise & JSXBase.HTMLAttributes<HTMLCapacitorEnterpriseElement>;
            "capacitor-hubspot-form": LocalJSX.CapacitorHubspotForm & JSXBase.HTMLAttributes<HTMLCapacitorHubspotFormElement>;
            "capacitor-site": LocalJSX.CapacitorSite & JSXBase.HTMLAttributes<HTMLCapacitorSiteElement>;
            "capacitor-site-footer": LocalJSX.CapacitorSiteFooter & JSXBase.HTMLAttributes<HTMLCapacitorSiteFooterElement>;
            "code-snippet": LocalJSX.CodeSnippet & JSXBase.HTMLAttributes<HTMLCodeSnippetElement>;
            "code-tabs": LocalJSX.CodeTabs & JSXBase.HTMLAttributes<HTMLCodeTabsElement>;
            "community-component": LocalJSX.CommunityComponent & JSXBase.HTMLAttributes<HTMLCommunityComponentElement>;
            "community-menu": LocalJSX.CommunityMenu & JSXBase.HTMLAttributes<HTMLCommunityMenuElement>;
            "community-page": LocalJSX.CommunityPage & JSXBase.HTMLAttributes<HTMLCommunityPageElement>;
            "contributor-list": LocalJSX.ContributorList & JSXBase.HTMLAttributes<HTMLContributorListElement>;
            "cordova-page": LocalJSX.CordovaPage & JSXBase.HTMLAttributes<HTMLCordovaPageElement>;
            "doc-snippet": LocalJSX.DocSnippet & JSXBase.HTMLAttributes<HTMLDocSnippetElement>;
            "docs-component": LocalJSX.DocsComponent & JSXBase.HTMLAttributes<HTMLDocsComponentElement>;
            "docs-menu": LocalJSX.DocsMenu & JSXBase.HTMLAttributes<HTMLDocsMenuElement>;
            "docs-search": LocalJSX.DocsSearch & JSXBase.HTMLAttributes<HTMLDocsSearchElement>;
            "in-page-navigation": LocalJSX.InPageNavigation & JSXBase.HTMLAttributes<HTMLInPageNavigationElement>;
            "landing-page": LocalJSX.LandingPage & JSXBase.HTMLAttributes<HTMLLandingPageElement>;
            "lower-content-nav": LocalJSX.LowerContentNav & JSXBase.HTMLAttributes<HTMLLowerContentNavElement>;
            "meta-tags": LocalJSX.MetaTags & JSXBase.HTMLAttributes<HTMLMetaTagsElement>;
            "more-button": LocalJSX.MoreButton & JSXBase.HTMLAttributes<HTMLMoreButtonElement>;
            "newsletter-signup": LocalJSX.NewsletterSignup & JSXBase.HTMLAttributes<HTMLNewsletterSignupElement>;
            "plugin-platforms": LocalJSX.PluginPlatforms & JSXBase.HTMLAttributes<HTMLPluginPlatformsElement>;
            "pre-footer": LocalJSX.PreFooter & JSXBase.HTMLAttributes<HTMLPreFooterElement>;
            "site-header": LocalJSX.SiteHeader & JSXBase.HTMLAttributes<HTMLSiteHeaderElement>;
            "solution-page": LocalJSX.SolutionPage & JSXBase.HTMLAttributes<HTMLSolutionPageElement>;
            "version-select": LocalJSX.VersionSelect & JSXBase.HTMLAttributes<HTMLVersionSelectElement>;
        }
    }
}
