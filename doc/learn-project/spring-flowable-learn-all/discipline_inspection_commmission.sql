/*
 Navicat Premium Data Transfer

 Source Server         : localhost-root-1qazxsw2!
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : discipline_inspection_commmission

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 24/04/2020 17:07:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dic_area_involved
-- ----------------------------
DROP TABLE IF EXISTS `dic_area_involved`;
CREATE TABLE `dic_area_involved`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `index_number` int(11) NULL DEFAULT NULL,
  `is_delete` bit(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '涉及领域' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dic_area_involved
-- ----------------------------
INSERT INTO `dic_area_involved` VALUES (5, '涉及领域1', 1, b'0');
INSERT INTO `dic_area_involved` VALUES (6, '涉及领域2', 2, b'0');
INSERT INTO `dic_area_involved` VALUES (7, '涉及领域3', 3, b'0');
INSERT INTO `dic_area_involved` VALUES (8, '涉及领域4', 4, b'0');
INSERT INTO `dic_area_involved` VALUES (9, '涉及领域5', 5, b'0');
INSERT INTO `dic_area_involved` VALUES (10, '修改涉及领域测试1', 99, b'0');
INSERT INTO `dic_area_involved` VALUES (12, '涉及领域测试1', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (13, '涉及领域测试1', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (14, '涉及领域测试1', 100, b'1');
INSERT INTO `dic_area_involved` VALUES (15, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (16, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (17, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (18, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (19, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (20, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (21, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (22, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (23, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (24, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (25, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (26, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (27, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (28, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (29, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (30, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (31, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (32, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (33, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (34, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (35, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (36, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (37, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (38, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (39, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (40, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (41, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (42, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (43, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (44, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (45, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (46, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (47, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (48, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (49, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (50, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (51, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (52, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (53, '测试数据', 100, b'0');
INSERT INTO `dic_area_involved` VALUES (54, '测试数据', 100, b'0');

-- ----------------------------
-- Table structure for dic_illegal_behavior
-- ----------------------------
DROP TABLE IF EXISTS `dic_illegal_behavior`;
CREATE TABLE `dic_illegal_behavior`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `index_number` int(11) NULL DEFAULT NULL,
  `is_delete` bit(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '违法行为' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dic_illegal_behavior
-- ----------------------------
INSERT INTO `dic_illegal_behavior` VALUES (5, '违法行为1', 1, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (6, '违法行为2', 2, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (8, '违法行为4', 4, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (9, '违法行为5', 5, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (10, '修改违法行为测试1', 99, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (12, '123', NULL, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (13, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (14, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (15, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (16, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (17, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (18, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (19, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (20, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (21, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (22, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (23, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (24, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (25, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (26, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (27, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (28, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (29, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (30, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (31, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (32, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (33, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (34, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (35, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (36, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (37, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (38, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (39, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (40, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (41, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (42, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (43, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (44, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (45, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (46, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (47, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (48, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (49, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (50, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (51, '测试数据', 100, b'0');
INSERT INTO `dic_illegal_behavior` VALUES (52, '测试数据', 100, b'0');

-- ----------------------------
-- Table structure for dic_job_rank
-- ----------------------------
DROP TABLE IF EXISTS `dic_job_rank`;
CREATE TABLE `dic_job_rank`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `index_number` int(11) NULL DEFAULT NULL,
  `is_delete` bit(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 52 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '职级' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dic_job_rank
-- ----------------------------
INSERT INTO `dic_job_rank` VALUES (5, '职级管理1', 1, b'0');
INSERT INTO `dic_job_rank` VALUES (6, '职级管理2', 2, b'0');
INSERT INTO `dic_job_rank` VALUES (7, '职级管理3', 3, b'0');
INSERT INTO `dic_job_rank` VALUES (8, '职级管理4', 4, b'0');
INSERT INTO `dic_job_rank` VALUES (9, '职级管理5', 5, b'0');
INSERT INTO `dic_job_rank` VALUES (10, '职级管理6', 6, b'0');
INSERT INTO `dic_job_rank` VALUES (11, '修改职级测试1', 99, b'1');
INSERT INTO `dic_job_rank` VALUES (12, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (13, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (14, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (15, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (16, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (17, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (18, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (19, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (20, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (21, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (22, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (23, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (24, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (25, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (26, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (27, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (28, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (29, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (30, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (31, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (32, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (33, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (34, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (35, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (36, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (37, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (38, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (39, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (40, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (41, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (42, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (43, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (44, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (45, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (46, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (47, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (48, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (49, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (50, '测试数据', 100, b'0');
INSERT INTO `dic_job_rank` VALUES (51, '测试数据', 100, b'0');

-- ----------------------------
-- Table structure for dic_job_type
-- ----------------------------
DROP TABLE IF EXISTS `dic_job_type`;
CREATE TABLE `dic_job_type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `index_number` int(11) NULL DEFAULT NULL,
  `is_delete` bit(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '干部类型表（是否村干部）' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dic_job_type
-- ----------------------------
INSERT INTO `dic_job_type` VALUES (10, '干部类型1', 6, b'0');
INSERT INTO `dic_job_type` VALUES (11, '干部类型2', 5, b'0');
INSERT INTO `dic_job_type` VALUES (12, '干部类型3', 3, b'0');
INSERT INTO `dic_job_type` VALUES (13, '干部类型4', 4, b'0');
INSERT INTO `dic_job_type` VALUES (14, '干部类型5', 5, b'0');
INSERT INTO `dic_job_type` VALUES (15, '干部类型6', 6, b'0');
INSERT INTO `dic_job_type` VALUES (16, '修改干部类型测试1', 99, b'1');
INSERT INTO `dic_job_type` VALUES (17, 'test1', 1, b'1');
INSERT INTO `dic_job_type` VALUES (18, 'test1', 1, b'1');
INSERT INTO `dic_job_type` VALUES (19, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (20, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (21, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (22, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (23, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (24, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (25, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (26, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (27, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (28, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (29, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (30, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (31, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (32, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (33, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (34, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (35, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (36, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (37, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (38, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (39, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (40, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (41, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (42, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (43, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (44, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (45, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (46, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (47, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (48, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (49, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (50, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (51, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (52, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (53, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (54, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (55, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (56, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (57, '测试数据', 100, b'0');
INSERT INTO `dic_job_type` VALUES (58, '测试数据', 100, b'0');

-- ----------------------------
-- Table structure for dic_result_type
-- ----------------------------
DROP TABLE IF EXISTS `dic_result_type`;
CREATE TABLE `dic_result_type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `index_number` int(11) NULL DEFAULT NULL,
  `is_delete` bit(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '信访信访室处理结果' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dic_result_type
-- ----------------------------
INSERT INTO `dic_result_type` VALUES (1, '分类1', 1, b'0');
INSERT INTO `dic_result_type` VALUES (2, '分类2', 2, b'0');
INSERT INTO `dic_result_type` VALUES (3, '案管', 3, b'0');

-- ----------------------------
-- Table structure for dic_source
-- ----------------------------
DROP TABLE IF EXISTS `dic_source`;
CREATE TABLE `dic_source`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '线索来源id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '线索来源名称',
  `index_number` int(11) NULL DEFAULT NULL COMMENT '排序',
  `is_delete` bit(1) NULL DEFAULT b'0' COMMENT '已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '线索来源数据字典表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dic_source
-- ----------------------------
INSERT INTO `dic_source` VALUES (1, '线索来源1', 1, b'0');
INSERT INTO `dic_source` VALUES (2, '线索来源2', 2, b'0');
INSERT INTO `dic_source` VALUES (3, '线索来源3', 3, b'0');
INSERT INTO `dic_source` VALUES (4, '线索来源4', 4, b'0');
INSERT INTO `dic_source` VALUES (5, '线索来源5', 5, b'0');
INSERT INTO `dic_source` VALUES (6, '线索来源6', 6, b'0');
INSERT INTO `dic_source` VALUES (7, '线索来源测试1', 100, b'0');
INSERT INTO `dic_source` VALUES (8, '修改线索来源测试1', 99, b'1');
INSERT INTO `dic_source` VALUES (9, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (10, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (11, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (12, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (13, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (14, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (15, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (16, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (17, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (18, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (19, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (20, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (21, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (22, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (23, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (24, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (25, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (26, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (27, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (28, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (29, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (30, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (31, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (32, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (33, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (34, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (35, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (36, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (37, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (38, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (39, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (40, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (41, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (42, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (43, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (44, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (45, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (46, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (47, '测试数据', 100, b'0');
INSERT INTO `dic_source` VALUES (48, '测试数据', 100, b'0');

-- ----------------------------
-- Table structure for his_review_clue
-- ----------------------------
DROP TABLE IF EXISTS `his_review_clue`;
CREATE TABLE `his_review_clue`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `let_clue_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '线索id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件标题',
  `bwld_content` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '本委领导批示',
  `bwld_id` int(11) NULL DEFAULT NULL COMMENT '本委领导id',
  `bwld_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '本委领导姓名',
  `bwld_sign` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '本委领导签字',
  `bwld_date` timestamp(0) NULL DEFAULT NULL COMMENT '本委领导批示时间',
  `fgfsj_content` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分管副书记意见',
  `fgfsj_id` int(11) NULL DEFAULT NULL COMMENT '分管副书记d',
  `fgfsj_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分管副书记名字',
  `fgfsj_sign` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分管副书记签字',
  `fgfsj_date` timestamp(0) NULL DEFAULT NULL COMMENT '分管副书记意见时间',
  `zgcw_content` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主管常委意见',
  `zgcw_id` int(11) NULL DEFAULT NULL COMMENT '主管常委id',
  `zgcw_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主管常委名字',
  `zgcw_sign` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主管常委签字',
  `zgcw_date` timestamp(0) NULL DEFAULT NULL COMMENT '主管常委意见时间',
  `scs_content` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审查室意见',
  `scs_id` int(11) NULL DEFAULT NULL COMMENT '审查室id',
  `scs_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审查室名字',
  `scs_sign` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审查室签字',
  `scs_date` timestamp(0) NULL DEFAULT NULL COMMENT '审查室意见时间',
  `operator` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '经办人',
  `operator_phone` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `is_finished` bit(1) NULL DEFAULT b'0' COMMENT '是否已结束',
  `create_date` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `current_step` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '当前步骤，取total_step中的permission',
  `total_step` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '总步骤',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '问题线索处置方案呈批笺' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of his_review_clue
-- ----------------------------
INSERT INTO `his_review_clue` VALUES (21, '20190001', '关于反映张三问题线索的处置方案', '123', 19, 'admin', NULL, '2019-08-01 19:32:43', '123', 19, 'admin', NULL, '2019-08-01 20:02:01', '123', 19, 'admin', NULL, '2019-08-01 20:02:17', '123', 19, 'admin', NULL, '2019-08-01 20:02:48', NULL, NULL, b'1', '2019-08-01 19:26:35', 'reviewLetClue:scs', '[{\"param\":[\"content\"],\"name\":\"本委领导批示\",\"permission\":\"reviewLetClue:bwld\"},{\"param\":[\"content\"],\"name\":\"分管副书记意见\",\"permission\":\"reviewLetClue:fgfsj\"},{\"param\":[\"content\"],\"name\":\"主管常委意见\",\"permission\":\"reviewLetClue:zgcw\"},{\"param\":[\"content\"],\"name\":\"审查室意见\",\"permission\":\"reviewLetClue:scs\"}]');
INSERT INTO `his_review_clue` VALUES (22, '20190004', '关于反映张三问题线索的处置方案', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', '2019-08-07 14:24:57', 'reviewLetClue:bwld', '[{\"param\":[\"content\"],\"name\":\"本委领导批示\",\"permission\":\"reviewLetClue:bwld\"},{\"param\":[\"content\"],\"name\":\"分管副书记意见\",\"permission\":\"reviewLetClue:fgfsj\"},{\"param\":[\"content\"],\"name\":\"主管常委意见\",\"permission\":\"reviewLetClue:zgcw\"},{\"param\":[\"content\"],\"name\":\"审查室意见\",\"permission\":\"reviewLetClue:scs\"}]');
INSERT INTO `his_review_clue` VALUES (23, '20190006', '关于反映张三问题线索的处置方案', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', '2019-08-07 14:25:30', 'reviewLetClue:bwld', '[{\"param\":[\"content\"],\"name\":\"本委领导批示\",\"permission\":\"reviewLetClue:bwld\"},{\"param\":[\"content\"],\"name\":\"分管副书记意见\",\"permission\":\"reviewLetClue:fgfsj\"},{\"param\":[\"content\"],\"name\":\"主管常委意见\",\"permission\":\"reviewLetClue:zgcw\"},{\"param\":[\"content\"],\"name\":\"审查室意见\",\"permission\":\"reviewLetClue:scs\"}]');
INSERT INTO `his_review_clue` VALUES (24, '20190030', '关于反映753，test问题线索的处置方案', '1', 19, 'admin', NULL, '2019-08-07 15:01:16', '2', 19, 'admin', NULL, '2019-08-07 15:01:20', '3', 19, 'admin', NULL, '2019-08-07 15:01:23', '4', 19, 'admin', NULL, '2019-08-07 15:01:27', NULL, NULL, b'1', '2019-08-07 14:51:40', '', '[{\"param\":[\"content\"],\"name\":\"本委领导批示\",\"permission\":\"reviewLetClue:bwld\"},{\"param\":[\"content\"],\"name\":\"分管副书记意见\",\"permission\":\"reviewLetClue:fgfsj\"},{\"param\":[\"content\"],\"name\":\"主管常委意见\",\"permission\":\"reviewLetClue:zgcw\"},{\"param\":[\"content\"],\"name\":\"审查室意见\",\"permission\":\"reviewLetClue:scs\"}]');

-- ----------------------------
-- Table structure for let_clue
-- ----------------------------
DROP TABLE IF EXISTS `let_clue`;
CREATE TABLE `let_clue`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '线索编码',
  `reception_time` date NULL DEFAULT NULL COMMENT '受理时间',
  `content` varchar(20000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '反映的主要问题（文本输入）',
  `create_date` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `is_processed` bit(1) NULL DEFAULT b'0' COMMENT '归档标记，已处理标记（无用）',
  `result_type_id` int(11) NULL DEFAULT 0 COMMENT '分类结果',
  `state_id` int(11) NULL DEFAULT NULL COMMENT '信访流程进度id（无用）',
  `is_delete` bit(1) NULL DEFAULT b'0' COMMENT '已删状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '信访表单' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_clue
-- ----------------------------
INSERT INTO `let_clue` VALUES ('20190001', '2019-06-19', '测1', '2019-07-24 17:07:36', b'0', 3, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190002', '2019-06-20', '修改成功', '2019-07-24 17:26:13', b'0', 0, NULL, b'1');
INSERT INTO `let_clue` VALUES ('20190003', '2019-06-19', '测1', '2019-07-24 17:26:28', b'0', 0, NULL, b'1');
INSERT INTO `let_clue` VALUES ('20190004', '2019-06-19', '测1', '2019-07-24 17:39:23', b'0', 3, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190005', '2019-06-19', '测1', '2019-07-24 17:42:41', b'0', 1, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190006', '2019-06-19', '测1', '2019-07-25 09:49:37', b'0', 3, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190007', '2019-06-19', '作风问题', '2019-07-26 10:36:57', b'0', 0, NULL, b'1');
INSERT INTO `let_clue` VALUES ('20190014', '2019-07-01', '45645645645645645456456456456456', '2019-07-30 14:18:43', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190015', '2019-07-01', '45645645645645645456456456456456', '2019-07-30 14:19:35', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190016', '2019-07-03', 'asdasd', '2019-07-30 14:21:55', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190017', '2019-07-03', '12345689', '2019-07-30 14:32:53', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190018', '2019-07-03', '12345689', '2019-07-30 14:32:56', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190019', '2019-07-05', 'asdad', '2019-07-30 15:19:28', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190020', '2019-07-21', '修改', '2019-07-30 16:00:25', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190021', '2019-07-04', '阿萨大大大', '2019-07-30 16:03:17', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190022', '2019-07-10', '123123', '2019-07-30 16:04:51', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190025', '2019-08-05', '123456789', '2019-08-05 10:48:24', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190026', '2019-08-04', '啊实打实大苏打', '2019-08-05 10:52:18', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190027', '2019-08-05', '123', '2019-08-05 10:54:54', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190028', '2019-08-02', '放个', '2019-08-05 10:58:41', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190029', '2019-08-05', '阿萨大大是', '2019-08-05 11:35:04', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190030', '2019-08-01', '753753753', '2019-08-06 17:06:11', b'0', 3, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190031', '2019-08-08', 'test1', '2019-08-07 14:17:32', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190032', '2019-07-30', 'test2', '2019-08-07 14:50:07', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190033', '2019-08-01', 'test3', '2019-08-07 17:01:20', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190034', '2019-08-08', 'test4', '2019-08-07 17:01:29', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190035', '2019-08-07', 'test5', '2019-08-07 17:01:43', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190036', '2019-08-03', 'test6', '2019-08-07 17:01:55', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190038', '2019-08-09', 'undefined', '2019-08-08 08:29:37', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190039', '2019-07-31', '123', '2019-08-08 08:30:13', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190040', '2019-07-31', '123', '2019-08-08 08:30:13', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190041', '2019-08-06', 'test4', '2019-08-08 08:30:54', b'0', 0, NULL, b'0');
INSERT INTO `let_clue` VALUES ('20190042', '2019-08-01', 'test5', '2019-08-08 08:31:49', b'0', 0, NULL, b'0');

-- ----------------------------
-- Table structure for let_clue_area_involved
-- ----------------------------
DROP TABLE IF EXISTS `let_clue_area_involved`;
CREATE TABLE `let_clue_area_involved`  (
  `clue_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `illegal_behavior_id` int(11) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '信访表单和设计领域关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_clue_area_involved
-- ----------------------------
INSERT INTO `let_clue_area_involved` VALUES ('20190001', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190002', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190003', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190005', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190006', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190007', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190015', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190015', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190015', 7);
INSERT INTO `let_clue_area_involved` VALUES ('20190015', 8);
INSERT INTO `let_clue_area_involved` VALUES ('20190016', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190018', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190018', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190019', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190019', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190021', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190021', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190025', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190025', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190026', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190026', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190026', 8);
INSERT INTO `let_clue_area_involved` VALUES ('20190027', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190027', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190028', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190028', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190029', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190020', 1);
INSERT INTO `let_clue_area_involved` VALUES ('20190020', 2);
INSERT INTO `let_clue_area_involved` VALUES ('20190004', 10);
INSERT INTO `let_clue_area_involved` VALUES ('20190004', 12);
INSERT INTO `let_clue_area_involved` VALUES ('20190031', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190031', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190017', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190017', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190032', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190030', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190030', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190014', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190014', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190014', 7);
INSERT INTO `let_clue_area_involved` VALUES ('20190014', 8);
INSERT INTO `let_clue_area_involved` VALUES ('20190033', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190034', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190035', 7);
INSERT INTO `let_clue_area_involved` VALUES ('20190036', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190022', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190022', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190022', 7);
INSERT INTO `let_clue_area_involved` VALUES ('20190039', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190040', 6);
INSERT INTO `let_clue_area_involved` VALUES ('20190041', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190042', 5);
INSERT INTO `let_clue_area_involved` VALUES ('20190042', 6);

-- ----------------------------
-- Table structure for let_clue_defendant
-- ----------------------------
DROP TABLE IF EXISTS `let_clue_defendant`;
CREATE TABLE `let_clue_defendant`  (
  `clue_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `defendant_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '被反映人' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_clue_defendant
-- ----------------------------
INSERT INTO `let_clue_defendant` VALUES ('20190001', '2019000101');
INSERT INTO `let_clue_defendant` VALUES ('20190002', '2019000201');
INSERT INTO `let_clue_defendant` VALUES ('20190003', '2019000301');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190005', '2019000501');
INSERT INTO `let_clue_defendant` VALUES ('20190006', '2019000601');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190015', '2019001501');
INSERT INTO `let_clue_defendant` VALUES ('20190015', '2019001502');
INSERT INTO `let_clue_defendant` VALUES ('20190016', '2019001601');
INSERT INTO `let_clue_defendant` VALUES ('20190017', '2019001701');
INSERT INTO `let_clue_defendant` VALUES ('20190018', '2019001801');
INSERT INTO `let_clue_defendant` VALUES ('20190019', '2019001901');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002001');
INSERT INTO `let_clue_defendant` VALUES ('20190021', '2019002101');
INSERT INTO `let_clue_defendant` VALUES ('20190022', '2019002201');
INSERT INTO `let_clue_defendant` VALUES ('20190025', '2019002501');
INSERT INTO `let_clue_defendant` VALUES ('20190025', '2019002502');
INSERT INTO `let_clue_defendant` VALUES ('20190025', '2019002503');
INSERT INTO `let_clue_defendant` VALUES ('20190026', '2019002601');
INSERT INTO `let_clue_defendant` VALUES ('20190026', '2019002602');
INSERT INTO `let_clue_defendant` VALUES ('20190027', '2019002701');
INSERT INTO `let_clue_defendant` VALUES ('20190027', '2019002702');
INSERT INTO `let_clue_defendant` VALUES ('20190028', '2019002801');
INSERT INTO `let_clue_defendant` VALUES ('20190029', '2019002901');
INSERT INTO `let_clue_defendant` VALUES ('20190029', '2019002902');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002001');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002002');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002001');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002002');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002001');
INSERT INTO `let_clue_defendant` VALUES ('20190020', '2019002002');
INSERT INTO `let_clue_defendant` VALUES ('20190030', '2019003001');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190004', '2019000401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190017', '2019001701');
INSERT INTO `let_clue_defendant` VALUES ('20190017', '2019001701');
INSERT INTO `let_clue_defendant` VALUES ('20190017', '2019001701');
INSERT INTO `let_clue_defendant` VALUES ('20190017', '2019001701');
INSERT INTO `let_clue_defendant` VALUES ('20190017', '2019001701');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190030', '2019003001');
INSERT INTO `let_clue_defendant` VALUES ('20190030', '2019003002');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001401');
INSERT INTO `let_clue_defendant` VALUES ('20190014', '2019001402');
INSERT INTO `let_clue_defendant` VALUES ('20190007', '2019000701');
INSERT INTO `let_clue_defendant` VALUES ('20190022', '2019002201');
INSERT INTO `let_clue_defendant` VALUES ('20190022', '2019002201');
INSERT INTO `let_clue_defendant` VALUES ('20190022', '2019002202');
INSERT INTO `let_clue_defendant` VALUES ('20190022', '2019002201');

-- ----------------------------
-- Table structure for let_clue_defendant_job_type
-- ----------------------------
DROP TABLE IF EXISTS `let_clue_defendant_job_type`;
CREATE TABLE `let_clue_defendant_job_type`  (
  `defendant_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `job_type_id` int(11) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '被反映人和是否村干关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_clue_defendant_job_type
-- ----------------------------
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000101', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000201', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000301', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000501', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000601', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001501', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001501', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001502', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001502', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001601', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001601', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001801', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001801', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001901', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001901', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002101', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002101', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002101', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002501', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002501', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002501', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002502', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002502', 13);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002503', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002503', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002601', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002601', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002602', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002602', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002701', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002702', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002801', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002801', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002901', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002902', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002001', 1);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002001', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002002', 1);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002002', 2);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000401', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000401', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001701', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001701', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019003001', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019003001', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019003002', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019003002', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019003002', 12);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001401', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001401', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001402', 10);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019001402', 11);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019000701', 1);
INSERT INTO `let_clue_defendant_job_type` VALUES ('2019002201', 10);

-- ----------------------------
-- Table structure for let_clue_illegal_behavior
-- ----------------------------
DROP TABLE IF EXISTS `let_clue_illegal_behavior`;
CREATE TABLE `let_clue_illegal_behavior`  (
  `clue_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `illegal_behavior_id` int(11) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '信访表单和主要违法行为关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_clue_illegal_behavior
-- ----------------------------
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190001', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190002', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190003', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190005', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190006', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190007', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190015', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190015', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190015', 6);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190015', 8);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190016', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190018', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190018', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190019', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190019', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190021', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190021', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190025', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190025', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190026', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190026', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190026', 8);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190027', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190027', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190028', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190028', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190029', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190020', 1);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190020', 2);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190004', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190004', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190031', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190031', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190017', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190017', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190032', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190030', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190030', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190014', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190014', 6);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190014', 8);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190014', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190033', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190034', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190035', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190036', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190022', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190022', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190039', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190040', 12);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190041', 13);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190042', 5);
INSERT INTO `let_clue_illegal_behavior` VALUES ('20190042', 6);

-- ----------------------------
-- Table structure for let_clue_source
-- ----------------------------
DROP TABLE IF EXISTS `let_clue_source`;
CREATE TABLE `let_clue_source`  (
  `clue_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '线索id',
  `source_id` int(11) NULL DEFAULT NULL COMMENT '来源id'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '信访表单和线索来源关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_clue_source
-- ----------------------------
INSERT INTO `let_clue_source` VALUES ('20190001', 1);
INSERT INTO `let_clue_source` VALUES ('20190002', 1);
INSERT INTO `let_clue_source` VALUES ('20190003', 1);
INSERT INTO `let_clue_source` VALUES ('20190005', 1);
INSERT INTO `let_clue_source` VALUES ('20190006', 1);
INSERT INTO `let_clue_source` VALUES ('20190015', 1);
INSERT INTO `let_clue_source` VALUES ('20190015', 2);
INSERT INTO `let_clue_source` VALUES ('20190016', 7);
INSERT INTO `let_clue_source` VALUES ('20190018', 1);
INSERT INTO `let_clue_source` VALUES ('20190018', 2);
INSERT INTO `let_clue_source` VALUES ('20190019', 1);
INSERT INTO `let_clue_source` VALUES ('20190019', 2);
INSERT INTO `let_clue_source` VALUES ('20190021', 2);
INSERT INTO `let_clue_source` VALUES ('20190025', 1);
INSERT INTO `let_clue_source` VALUES ('20190026', 1);
INSERT INTO `let_clue_source` VALUES ('20190026', 2);
INSERT INTO `let_clue_source` VALUES ('20190027', 2);
INSERT INTO `let_clue_source` VALUES ('20190027', 1);
INSERT INTO `let_clue_source` VALUES ('20190028', 1);
INSERT INTO `let_clue_source` VALUES ('20190028', 2);
INSERT INTO `let_clue_source` VALUES ('20190029', 1);
INSERT INTO `let_clue_source` VALUES ('20190029', 2);
INSERT INTO `let_clue_source` VALUES ('20190020', 1);
INSERT INTO `let_clue_source` VALUES ('20190020', 2);
INSERT INTO `let_clue_source` VALUES ('20190004', 1);
INSERT INTO `let_clue_source` VALUES ('20190031', 1);
INSERT INTO `let_clue_source` VALUES ('20190031', 2);
INSERT INTO `let_clue_source` VALUES ('20190031', 3);
INSERT INTO `let_clue_source` VALUES ('20190017', 1);
INSERT INTO `let_clue_source` VALUES ('20190017', 2);
INSERT INTO `let_clue_source` VALUES ('20190032', 4);
INSERT INTO `let_clue_source` VALUES ('20190030', 1);
INSERT INTO `let_clue_source` VALUES ('20190030', 2);
INSERT INTO `let_clue_source` VALUES ('20190014', 1);
INSERT INTO `let_clue_source` VALUES ('20190014', 2);
INSERT INTO `let_clue_source` VALUES ('20190007', 1);
INSERT INTO `let_clue_source` VALUES ('20190034', 6);
INSERT INTO `let_clue_source` VALUES ('20190035', 2);
INSERT INTO `let_clue_source` VALUES ('20190036', 3);
INSERT INTO `let_clue_source` VALUES ('20190036', 2);
INSERT INTO `let_clue_source` VALUES ('20190022', 1);
INSERT INTO `let_clue_source` VALUES ('20190022', 2);
INSERT INTO `let_clue_source` VALUES ('20190022', 3);
INSERT INTO `let_clue_source` VALUES ('20190038', 1);
INSERT INTO `let_clue_source` VALUES ('20190039', 2);
INSERT INTO `let_clue_source` VALUES ('20190040', 2);
INSERT INTO `let_clue_source` VALUES ('20190041', 3);
INSERT INTO `let_clue_source` VALUES ('20190042', 1);

-- ----------------------------
-- Table structure for let_defendant
-- ----------------------------
DROP TABLE IF EXISTS `let_defendant`;
CREATE TABLE `let_defendant`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `company_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工作单位名称',
  `post_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '职务',
  `job_rank_id` int(255) NULL DEFAULT NULL COMMENT '职级',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '被反映人' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_defendant
-- ----------------------------
INSERT INTO `let_defendant` VALUES ('2019000101', '张三', '某某某单位', NULL, 1);
INSERT INTO `let_defendant` VALUES ('2019000201', '张三', '某某某单位', NULL, 1);
INSERT INTO `let_defendant` VALUES ('2019000301', '张三', '某某某单位', NULL, 1);
INSERT INTO `let_defendant` VALUES ('2019000401', '张三', '某某某单位', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019000501', '张三', '某某某单位', NULL, 1);
INSERT INTO `let_defendant` VALUES ('2019000601', '张三', '某某某单位', NULL, 1);
INSERT INTO `let_defendant` VALUES ('2019000701', '张三', '某某某单位', NULL, 1);
INSERT INTO `let_defendant` VALUES ('2019001401', '123', '123', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001402', '456', '456', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001501', '123', '123', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001502', '456', '456', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001601', 'qwe', 'sad', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001701', '123', '123', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001801', '123', '123', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019001901', 'asd', 'asd', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002001', '王五', '阿里巴巴研究部', '科员', 1);
INSERT INTO `let_defendant` VALUES ('2019002002', '马六', '阿里巴巴研究部', '科员', 1);
INSERT INTO `let_defendant` VALUES ('2019002101', '阿斯顿', '阿三的', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002201', '2', '2', NULL, 9);
INSERT INTO `let_defendant` VALUES ('2019002501', '123', '123', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002502', '456', '456', NULL, 6);
INSERT INTO `let_defendant` VALUES ('2019002503', '789', '789', NULL, 7);
INSERT INTO `let_defendant` VALUES ('2019002601', '阿甘', '村长', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002602', '阿飘', 'U0', NULL, 6);
INSERT INTO `let_defendant` VALUES ('2019002701', '111', '111', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002702', '222', '222', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002801', '我问问', '哇哇哇哇', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002901', '请问', ' 请问', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019002902', '阿斯顿', '阿斯顿', NULL, 6);
INSERT INTO `let_defendant` VALUES ('2019003001', '753', '753', NULL, 5);
INSERT INTO `let_defendant` VALUES ('2019003002', 'test', 'test', NULL, 6);

-- ----------------------------
-- Table structure for let_stuff
-- ----------------------------
DROP TABLE IF EXISTS `let_stuff`;
CREATE TABLE `let_stuff`  (
  `clue_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0',
  `create_date` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 123 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '上传附件' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of let_stuff
-- ----------------------------
INSERT INTO `let_stuff` VALUES ('20190002', 42, 'QQ图片20181010140443.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-07-24/201907240926221718.jpg', '0', '2019-07-24 17:26:13');
INSERT INTO `let_stuff` VALUES ('20190003', 43, 'QQ图片20181010140443.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-07-24/201907240926378884.jpg', '0', '2019-07-24 17:26:28');
INSERT INTO `let_stuff` VALUES ('20190005', 45, 'QQ图片20181010140443.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-07-24/201907240942509697.jpg', '0', '2019-07-24 17:42:41');
INSERT INTO `let_stuff` VALUES ('20190006', 46, 'QQ图片20181010140443.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-07-25/201907250949497194.jpg', '0', '2019-07-25 09:49:38');
INSERT INTO `let_stuff` VALUES ('20190016', 49, '3a01db1ee34799cc12b00c561a3d010.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-07-30/201907301421581991.jpg', '0', '2019-07-30 14:21:56');
INSERT INTO `let_stuff` VALUES ('20190019', 51, '3a01db1ee34799cc12b00c561a3d010.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-07-30/201907301519313485.jpg', '0', '2019-07-30 15:19:29');
INSERT INTO `let_stuff` VALUES ('20190020', 52, '信访字段.png', 'discipline-inspection-commission/file/scanningCopy/2019-07-30/201907301600297868.png', '0', '2019-07-30 16:00:26');
INSERT INTO `let_stuff` VALUES ('20190021', 53, '信访字段.png', 'discipline-inspection-commission/file/scanningCopy/2019-07-30/201907301603205151.png', '0', '2019-07-30 16:03:18');
INSERT INTO `let_stuff` VALUES ('20190022', 54, '信访字段.png', 'discipline-inspection-commission/file/scanningCopy/2019-07-30/201907301604543189.png', '0', '2019-07-30 16:04:52');
INSERT INTO `let_stuff` VALUES ('20190026', 56, '信访字段.png', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051052201100.png', '0', '2019-08-05 10:52:20');
INSERT INTO `let_stuff` VALUES ('20190027', 57, '1.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/20190805105455258.jpg', '0', '2019-08-05 10:54:55');
INSERT INTO `let_stuff` VALUES ('20190027', 58, '6ac0f0aaec998e71.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051054553974.jpg', '0', '2019-08-05 10:54:55');
INSERT INTO `let_stuff` VALUES ('20190028', 59, 'code-wallpaper-2.jpeg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051058423823.jpeg', '0', '2019-08-05 10:58:42');
INSERT INTO `let_stuff` VALUES ('20190028', 60, 'code-wallpaper-8.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051058421956.jpg', '0', '2019-08-05 10:58:42');
INSERT INTO `let_stuff` VALUES ('20190028', 61, 'timg.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051058426797.jpg', '0', '2019-08-05 10:58:42');
INSERT INTO `let_stuff` VALUES ('20190029', 62, 'timg (1).jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051135044209.jpg', '0', '2019-08-05 11:35:04');
INSERT INTO `let_stuff` VALUES ('20190029', 63, 'timg (2).jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051135041003.jpg', '0', '2019-08-05 11:35:04');
INSERT INTO `let_stuff` VALUES ('20190029', 64, 'timg.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-05/201908051135047374.jpg', '0', '2019-08-05 11:35:04');
INSERT INTO `let_stuff` VALUES ('20190004', 65, 'timg (1).jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071001159720.jpg', '0', '2019-08-07 10:01:14');
INSERT INTO `let_stuff` VALUES ('20190004', 68, '1.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/20190807101418444.jpg', '0', '2019-08-07 10:14:17');
INSERT INTO `let_stuff` VALUES ('20190004', 69, '30650423_6.jpeg', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071014188804.jpeg', '0', '2019-08-07 10:14:17');
INSERT INTO `let_stuff` VALUES ('20190031', 70, '4351238a13023a81420f8f3e3f26eb2a.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071417355183.jpg', '0', '2019-08-07 14:17:33');
INSERT INTO `let_stuff` VALUES ('20190031', 71, 'fceaead03f53e606471d30985c1a5c96.jpg', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071417365629.jpg', '0', '2019-08-07 14:17:33');
INSERT INTO `let_stuff` VALUES ('20190031', 72, 'IMG_0053(20180101-100922).png', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071417365111.png', '0', '2019-08-07 14:17:34');
INSERT INTO `let_stuff` VALUES ('20190031', 73, 'QQ图片20181219174242.gif', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071417406342.gif', '0', '2019-08-07 14:17:37');
INSERT INTO `let_stuff` VALUES ('20190017', 92, '1.zip', NULL, '0', '2019-08-07 14:29:40');
INSERT INTO `let_stuff` VALUES ('20190017', 93, '2.txt', NULL, '0', '2019-08-07 14:29:40');
INSERT INTO `let_stuff` VALUES ('20190017', 94, '3.png', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071429437611.png', '0', '2019-08-07 14:29:41');
INSERT INTO `let_stuff` VALUES ('20190017', 95, '4.doc', NULL, '0', '2019-08-07 14:29:42');
INSERT INTO `let_stuff` VALUES ('20190017', 96, '5.pdf', NULL, '0', '2019-08-07 14:29:42');
INSERT INTO `let_stuff` VALUES ('20190030', 103, '1.zip', NULL, '0', '2019-08-07 14:51:00');
INSERT INTO `let_stuff` VALUES ('20190030', 104, '2.txt', NULL, '0', '2019-08-07 14:51:00');
INSERT INTO `let_stuff` VALUES ('20190007', 112, '3.png', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071516356761.png', '0', '2019-08-07 15:16:32');
INSERT INTO `let_stuff` VALUES ('20190014', 122, '30650423_2.jpeg', 'discipline-inspection-commission/file/scanningCopy/2019-08-07/201908071520228777.jpeg', '0', '2019-08-07 15:20:19');

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `parent_id` bigint(20) NULL DEFAULT NULL COMMENT '父id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名称',
  `permission` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限值（唯一）',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '类型group,page,button',
  `is_enable` bit(1) NULL DEFAULT b'1' COMMENT '可用',
  `is_delete` bit(1) NULL DEFAULT b'0' COMMENT '已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES (1, NULL, '系统管理', NULL, 'group', b'1', b'0');
INSERT INTO `sys_permission` VALUES (2, 1, '权限管理', 'permission', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (3, 1, '角色管理', 'role', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (6, 1, '组织结构管理', 'unit', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (7, 1, '用户管理', 'user', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (8, NULL, '空1', NULL, NULL, b'1', b'1');
INSERT INTO `sys_permission` VALUES (9, NULL, '空2', NULL, NULL, b'1', b'1');
INSERT INTO `sys_permission` VALUES (10, NULL, '空3', NULL, NULL, b'1', b'1');
INSERT INTO `sys_permission` VALUES (11, 29, '信访举报表单', 'letClue', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (12, 11, '录入', 'letClue:insert', 'permission', b'1', b'1');
INSERT INTO `sys_permission` VALUES (13, 11, '删除', 'letClue:delete', 'permission', b'1', b'1');
INSERT INTO `sys_permission` VALUES (14, 11, '修改', 'letClue:update', 'permission', b'1', b'1');
INSERT INTO `sys_permission` VALUES (15, 11, '查看', 'letClue:select', 'permission', b'1', b'1');
INSERT INTO `sys_permission` VALUES (16, NULL, '线索审批', 'reviewLetClue', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (17, 16, '本委领导', 'reviewLetClue:bwld', 'permission', b'1', b'0');
INSERT INTO `sys_permission` VALUES (18, 16, '分管副书记', 'reviewLetClue:fgfsj', 'permission', b'1', b'0');
INSERT INTO `sys_permission` VALUES (19, 16, '主管常委', 'reviewLetClue:zgcw', 'permission', b'1', b'0');
INSERT INTO `sys_permission` VALUES (20, 16, '审查室', 'reviewLetClue:scs', 'permission', b'1', b'0');
INSERT INTO `sys_permission` VALUES (27, 29, '信访举报分类', 'letClueType', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (28, NULL, '数据字典', 'dicAll', 'page', b'1', b'0');
INSERT INTO `sys_permission` VALUES (29, NULL, '信访举报部门', NULL, 'group', b'1', b'0');
INSERT INTO `sys_permission` VALUES (30, NULL, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (31, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (32, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (33, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (34, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (35, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (36, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (37, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (38, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (39, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (40, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (41, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (42, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (43, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (44, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (45, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (46, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (47, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (48, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (49, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (50, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (51, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (52, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (53, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (54, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (55, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (56, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (57, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (58, 30, '测试数据', NULL, NULL, b'1', b'0');
INSERT INTO `sys_permission` VALUES (59, 30, '测试数据', NULL, NULL, b'1', b'0');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色名',
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色值',
  `is_enable` bit(1) NULL DEFAULT b'1' COMMENT '可用',
  `is_delete` bit(1) NULL DEFAULT b'0' COMMENT '已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '角色1', 'role1', b'1', b'0');
INSERT INTO `sys_role` VALUES (2, '角色2', 'role2', b'1', b'0');
INSERT INTO `sys_role` VALUES (3, '角色3', 'role3', b'1', b'0');
INSERT INTO `sys_role` VALUES (4, '角色', 'role', b'1', b'0');
INSERT INTO `sys_role` VALUES (5, '角色4', 'role4', b'1', b'1');
INSERT INTO `sys_role` VALUES (6, '角色4', '角色4', b'1', b'0');
INSERT INTO `sys_role` VALUES (7, '角色5', '角色5', b'1', b'0');
INSERT INTO `sys_role` VALUES (8, '角色6', '角色6', b'1', b'0');
INSERT INTO `sys_role` VALUES (9, '修改角色测试1', 'rt1', b'1', b'1');
INSERT INTO `sys_role` VALUES (10, '线索审批角色', 'review:letClue', b'1', b'0');

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission`  (
  `role_id` bigint(20) NULL DEFAULT NULL,
  `permission_id` bigint(20) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色-权限关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------
INSERT INTO `sys_role_permission` VALUES (2, 1);
INSERT INTO `sys_role_permission` VALUES (3, 2);
INSERT INTO `sys_role_permission` VALUES (3, 3);
INSERT INTO `sys_role_permission` VALUES (10, 7);
INSERT INTO `sys_role_permission` VALUES (10, 2);
INSERT INTO `sys_role_permission` VALUES (10, 3);
INSERT INTO `sys_role_permission` VALUES (10, 8);
INSERT INTO `sys_role_permission` VALUES (4, 7);
INSERT INTO `sys_role_permission` VALUES (4, 2);
INSERT INTO `sys_role_permission` VALUES (9, 2);
INSERT INTO `sys_role_permission` VALUES (9, 3);
INSERT INTO `sys_role_permission` VALUES (10, 16);
INSERT INTO `sys_role_permission` VALUES (10, 17);
INSERT INTO `sys_role_permission` VALUES (10, 18);
INSERT INTO `sys_role_permission` VALUES (10, 19);
INSERT INTO `sys_role_permission` VALUES (10, 20);
INSERT INTO `sys_role_permission` VALUES (1, 27);
INSERT INTO `sys_role_permission` VALUES (1, 11);
INSERT INTO `sys_role_permission` VALUES (1, 28);
INSERT INTO `sys_role_permission` VALUES (1, 2);
INSERT INTO `sys_role_permission` VALUES (1, 7);
INSERT INTO `sys_role_permission` VALUES (1, 6);
INSERT INTO `sys_role_permission` VALUES (1, 3);
INSERT INTO `sys_role_permission` VALUES (1, 19);
INSERT INTO `sys_role_permission` VALUES (1, 18);
INSERT INTO `sys_role_permission` VALUES (1, 20);
INSERT INTO `sys_role_permission` VALUES (1, 17);

-- ----------------------------
-- Table structure for sys_signature
-- ----------------------------
DROP TABLE IF EXISTS `sys_signature`;
CREATE TABLE `sys_signature`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NULL DEFAULT NULL COMMENT '用户id',
  `sign_file_path` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '签名文件路径',
  `create_date` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间（自动填充）',
  `is_default` bit(1) NULL DEFAULT b'0' COMMENT '是否作为默认签名（默认否）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_signature
-- ----------------------------

-- ----------------------------
-- Table structure for sys_unit
-- ----------------------------
DROP TABLE IF EXISTS `sys_unit`;
CREATE TABLE `sys_unit`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `parent_id` bigint(20) NULL DEFAULT NULL COMMENT '父id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名称',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '类型',
  `is_delete` bit(1) NULL DEFAULT b'0' COMMENT '是否已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 47 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '单位表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_unit
-- ----------------------------
INSERT INTO `sys_unit` VALUES (1, NULL, '单位1', '', b'0');
INSERT INTO `sys_unit` VALUES (2, 6, '单位2', '单位', b'1');
INSERT INTO `sys_unit` VALUES (3, NULL, '单位3', NULL, b'1');
INSERT INTO `sys_unit` VALUES (4, 1, '修改单位测试1', 'type1', b'1');
INSERT INTO `sys_unit` VALUES (5, 0, '', '', b'0');
INSERT INTO `sys_unit` VALUES (6, 3, '测试1', '测试', b'0');
INSERT INTO `sys_unit` VALUES (7, 1, '测试2', '测试', b'0');
INSERT INTO `sys_unit` VALUES (8, 13, '测试3', '测试', b'0');
INSERT INTO `sys_unit` VALUES (9, 2, '单位2一级测试', '单位2测试', b'1');
INSERT INTO `sys_unit` VALUES (10, 8, '单位3二级测试', '单位3', b'0');
INSERT INTO `sys_unit` VALUES (11, NULL, '123', '124', b'1');
INSERT INTO `sys_unit` VALUES (12, 1, '21', '21', b'1');
INSERT INTO `sys_unit` VALUES (13, NULL, '单位2', '单位2', b'0');
INSERT INTO `sys_unit` VALUES (14, 13, '测试1', '单位2', b'0');
INSERT INTO `sys_unit` VALUES (15, NULL, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (16, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (17, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (18, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (19, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (20, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (21, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (22, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (23, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (24, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (25, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (26, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (27, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (28, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (29, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (30, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (31, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (32, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (33, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (34, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (35, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (36, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (37, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (38, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (39, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (40, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (41, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (42, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (43, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (44, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (45, 15, '测试数据', NULL, b'0');
INSERT INTO `sys_unit` VALUES (46, 15, '测试数据', NULL, b'0');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `is_enable` bit(1) NULL DEFAULT b'1' COMMENT '可用',
  `is_delete` bit(1) NULL DEFAULT b'0' COMMENT '已删除',
  `is_admin` bit(1) NULL DEFAULT b'0' COMMENT '管理员账号',
  `is_basic` bit(1) NULL DEFAULT b'0' COMMENT '基础账号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (19, 'admin', 'admin', '$2a$10$GJn.PyATnpMXmN10d8KyBugfHZUJEschlNgm9XMYdDny2oo2mvZgK', b'1', b'0', b'1', b'0');
INSERT INTO `sys_user` VALUES (20, 'test1', 'test1', '$2a$10$Tiw7puaWS8IKx0VOzgA.DuAyxLlUsbVgQYRgDMNsdsOiT9/Lf0pxq', b'1', b'0', b'0', b'0');
INSERT INTO `sys_user` VALUES (21, 're1', 're1', '$2a$10$Tiw7puaWS8IKx0VOzgA.DuAyxLlUsbVgQYRgDMNsdsOiT9/Lf0pxq', b'1', b'0', b'0', b'0');
INSERT INTO `sys_user` VALUES (22, 're2', 're2', '$2a$10$Tiw7puaWS8IKx0VOzgA.DuAyxLlUsbVgQYRgDMNsdsOiT9/Lf0pxq', b'1', b'0', b'0', b'0');
INSERT INTO `sys_user` VALUES (23, 're3', 're3', '$2a$10$Tiw7puaWS8IKx0VOzgA.DuAyxLlUsbVgQYRgDMNsdsOiT9/Lf0pxq', b'1', b'0', b'0', b'0');
INSERT INTO `sys_user` VALUES (25, 'string', 'string', '$2a$10$LwxTJ9XIF/iHgJZCX4MJvOc/oHbjd2AcqukDFBK60bqoUNNibBkbW', b'1', b'1', b'0', b'0');
INSERT INTO `sys_user` VALUES (27, '123', '123', '$2a$10$PA1JF.th3Cpe3Xm3RKSFheEzB2ZNail0T5nlU3QMuNzqF12lw5SjG', b'1', b'1', b'0', b'0');
INSERT INTO `sys_user` VALUES (29, 'test2', 'test2', '$2a$10$rqyncbXlony4lHPS.zCntu5kOpPR7ivAsVrkrKcYiHOM2gIoduEMu', b'1', b'0', b'0', b'0');
INSERT INTO `sys_user` VALUES (30, '修改用户1', 'ut1', '$2a$10$xywNU003F8UEA663jkAwC.54svE2sYth3qLxrXRVIUcogxJq7Mbjy', b'1', b'1', b'0', b'0');
INSERT INTO `sys_user` VALUES (31, '', '', '$2a$10$YO8bJwFfGURWDndHlZOSy.OfnI/c4A6wNHtP8EqbMCiXMmDmHzVPu', b'1', b'1', b'0', b'0');
INSERT INTO `sys_user` VALUES (32, '测试1', 'ceshi1', '$2a$10$5H7oicw1Iv86rOp8ZVb0Ke9kJ73sGgAVyShsJgtx57oM0e7Xxc/Im', b'1', b'0', b'0', b'0');
INSERT INTO `sys_user` VALUES (33, 'ceshi2', 'ces2', '$2a$10$JoUP23kOtjq.uCxo4IHzLuQdQolDzRFftp4AmY4/TabfqPLfkayfC', b'0', b'0', b'0', b'0');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `user_id` bigint(20) NULL DEFAULT NULL,
  `role_id` bigint(20) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户-角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (191, 4);
INSERT INTO `sys_user_role` VALUES (30, 2);
INSERT INTO `sys_user_role` VALUES (30, 3);
INSERT INTO `sys_user_role` VALUES (30, 4);
INSERT INTO `sys_user_role` VALUES (20, 4);
INSERT INTO `sys_user_role` VALUES (32, 1);
INSERT INTO `sys_user_role` VALUES (32, 4);
INSERT INTO `sys_user_role` VALUES (32, 1);
INSERT INTO `sys_user_role` VALUES (33, 10);
INSERT INTO `sys_user_role` VALUES (33, 4);
INSERT INTO `sys_user_role` VALUES (19, 2);
INSERT INTO `sys_user_role` VALUES (19, 3);
INSERT INTO `sys_user_role` VALUES (19, 4);
INSERT INTO `sys_user_role` VALUES (19, 10);

-- ----------------------------
-- Table structure for sys_user_unit
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_unit`;
CREATE TABLE `sys_user_unit`  (
  `user_id` bigint(20) NULL DEFAULT NULL,
  `unit_id` bigint(20) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户-单位关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_unit
-- ----------------------------
INSERT INTO `sys_user_unit` VALUES (30, 2);
INSERT INTO `sys_user_unit` VALUES (20, NULL);
INSERT INTO `sys_user_unit` VALUES (32, 8);
INSERT INTO `sys_user_unit` VALUES (33, 1);
INSERT INTO `sys_user_unit` VALUES (19, 1);

SET FOREIGN_KEY_CHECKS = 1;
