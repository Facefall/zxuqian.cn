/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, useEffect, useState } from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import BlogPostItem from "../BlogPostItem";
import BlogListPaginator from "@theme/BlogListPaginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faQq,
  faWeixin,
} from "@fortawesome/free-brands-svg-icons";
import useBaseUrl from "@docusaurus/useBaseUrl";
// import bilibiliIcon from "@site/static/icons/bilibili.svg";

import useThemeContext from "@theme/hooks/useThemeContext";
import useFollowers from "./useFollowers";

function BlogListPage(props) {
  const { metadata, items } = props;

  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const isBlogOnlyMode = metadata.permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : "Blog";
  const description = `不仅仅是前端工程师，分享React.js, HTML, CSS, JavaScript, Node.js 技术以及个人发展、自我提升相关的心得`;

  // Get all post views
  const postIds = items.map(({ content }) => {
    return content?.frontMatter?.slug;
  });
  const [views, setViews] = useState([]);
  const getViews = async () => {
    try {
      const res = await fetch("https://api.zxuqian.cn/post/views", {
        method: "POST",
        body: JSON.stringify(postIds),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const views = await res.json();
      setViews(views);
    } catch (error) {}
  };

  useEffect(() => {
    getViews();
  }, []);

  const followers = useFollowers();

  return (
    <Layout title={title} description={description}>
      {/* 个人简介 */}
      <div className="hero">
        <div className="bloghome__intro">
          <h1>
            Hello! 我是<span className="intro__name">峰华</span>
          </h1>
          <p>
            致力于将编程和艺术相结合，以直观、生动、有趣的方式呈现枯燥的编程概念和原理，助你以最快的速度、愉快的心情掌握编程技巧，进而提升工作竞争力和创新创业能力。
          </p>
          <div>
            <a
              href="https://space.bilibili.com/302954484?from=search&seid=1788147379248960737"
              className="bloghome__follow"
            >
              + 关注 ({(Math.round(followers) / 10000).toFixed(1)} 万)
            </a>
          </div>
          <p>QQ 1 群：644722908，QQ 2 群：1004912565</p>
          <SocialLinks />
        </div>
        <div className="bloghome__image">
          <img src="/img/hero_main.svg" />
        </div>
      </div>
      <div className="container margin-vert--sm">
        <div className="row">
          <div className="col col--12">
            {/* <div className="content__divider"></div> */}
            <h1 className="blog__section_title">
              最新博客&nbsp;
              <svg
                width="31"
                height="31"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.8333 5.16666H5.16668C3.73293 5.16666 2.59626 6.31624 2.59626 7.74999L2.58334 23.25C2.58334 24.6837 3.73293 25.8333 5.16668 25.8333H25.8333C27.2671 25.8333 28.4167 24.6837 28.4167 23.25V7.74999C28.4167 6.31624 27.2671 5.16666 25.8333 5.16666ZM10.9792 19.375H9.42918L6.13543 14.8542V19.375H4.52084V11.625H6.13543L9.36459 16.1458V11.625H10.9792V19.375ZM17.4375 13.2525H14.2083V14.6992H17.4375V16.3267H14.2083V17.7604H17.4375V19.375H12.2708V11.625H17.4375V13.2525ZM26.4792 18.0833C26.4792 18.7937 25.8979 19.375 25.1875 19.375H20.0208C19.3104 19.375 18.7292 18.7937 18.7292 18.0833V11.625H20.3438V17.4504H21.8033V12.9037H23.4179V17.4375H24.8646V11.625H26.4792V18.0833Z"
                  fill="#4490D6"
                />
              </svg>
            </h1>
            <div className="bloghome__posts">
              {items.map(({ content: BlogPostContent }) => (
                <BlogPostItem
                  key={BlogPostContent.metadata.permalink}
                  frontMatter={BlogPostContent.frontMatter}
                  metadata={BlogPostContent.metadata}
                  truncated={BlogPostContent.metadata.truncated}
                  views={
                    views.find(
                      (v) => v.slug == BlogPostContent.frontMatter.slug
                    )?.views
                  }
                >
                  <BlogPostContent />
                </BlogPostItem>
              ))}
              <BlogListPaginator metadata={metadata} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SocialLinks({ ...props }) {
  const { isDarkTheme } = useThemeContext();
  return (
    <div className="social__links">
      <a href="https://space.bilibili.com/302954484">
        <img
          src={useBaseUrl(`icons/bilibili${isDarkTheme ? "-dark" : ""}.svg`)}
          alt="bilibili"
        />
      </a>
      <a href="https://www.linkedin.com/in/zxuqian/">
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
      <a href="https://github.com/zxuqian">
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <div class="dropdown dropdown--hoverable">
        <FontAwesomeIcon icon={faWeixin} color="#07C160" size="lg" />
        <span>公众号</span>
        <img
          width="50%"
          className="dropdown__menu"
          src={useBaseUrl("/img/publicQR.png")}
        />
      </div>
    </div>
  );
}

export default BlogListPage;
